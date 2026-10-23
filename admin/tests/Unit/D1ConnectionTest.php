<?php

namespace Tests\Unit;

use PDOException;
use PHPUnit\Framework\TestCase;
use RenokiCo\L1\CloudflareD1Connector;
use RenokiCo\L1\D1\D1Connection;
use Saloon\Http\Faking\MockClient;
use Saloon\Http\Faking\MockResponse;
use Saloon\Http\PendingRequest;

class D1ConnectionTest extends TestCase
{
    public function test_bound_input_is_sent_separately_from_sql_with_bearer_auth(): void
    {
        $input = "O'Brien'); DROP TABLE events; --";
        $mock = new MockClient([
            MockResponse::make(['success' => true, 'result' => [['results' => [['id' => 42]], 'meta' => []]]]),
        ]);
        $connector = new CloudflareD1Connector('test-database', 'test-token', 'test-account');
        $connector->withMockClient($mock);
        $connection = new D1Connection($connector);

        $rows = $connection->select('select id from events where title = ?', [$input]);

        $this->assertSame(42, $rows[0]->id);
        $request = $mock->getLastPendingRequest();
        $this->assertInstanceOf(PendingRequest::class, $request);
        $this->assertSame('https://api.cloudflare.com/client/v4/accounts/test-account/d1/database/test-database/query', $request->getUrl());
        $this->assertSame('Bearer test-token', $request->headers()->get('Authorization'));
        $this->assertSame('select id from events where title = ?', $request->body()->get('sql'));
        $this->assertSame([$input], $request->body()->get('params'));
    }

    public function test_d1_errors_are_not_treated_as_successful_queries(): void
    {
        $connector = new CloudflareD1Connector('test-database', 'test-token', 'test-account');
        $connector->withMockClient(new MockClient([
            MockResponse::make(['success' => false, 'errors' => [['message' => 'Query rejected', 'code' => 7500]]], 400),
        ]));

        $this->expectException(PDOException::class);
        (new D1Connection($connector))->select('select ?', [1]);
    }

    public function test_schema_grammar_supports_laravel_twelve_signatures_and_quotes_names(): void
    {
        $connection = new D1Connection(new CloudflareD1Connector('test-database', 'test-token', 'test-account'));
        $grammar = $connection->getSchemaBuilder()->getConnection()->getSchemaGrammar();

        $sql = $grammar->compileTableExists(null, "events' OR 1=1 --");
        $this->assertStringContainsString('sqlite_schema', $sql);
        $this->assertStringContainsString("'events'' OR 1=1 --'", $sql);
        $this->assertStringContainsString('sqlite_schema', $grammar->compileViews('main'));
        $this->assertStringNotContainsString('dbstat', $grammar->compileTables('main', true));
    }
}
