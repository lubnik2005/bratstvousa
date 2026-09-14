<?php

namespace App\Database;

use Generator;
use RenokiCo\L1\D1\D1Connection as BaseD1Connection;

/**
 * Cloudflare D1 connection with a working cursor().
 *
 * The renoki-co/l1 D1 PDO statement implements fetchAll() but NOT the
 * single-row fetch() that Laravel's Connection::cursor() relies on. Nova's
 * global search reads results via Builder::cursor(), so any D1-backed
 * resource made the global search 500 with:
 *   "RenokiCo\L1\D1\Pdo\D1PdoStatement object is uninitialized".
 *
 * We override cursor() to fall back to the fully-supported, non-streaming
 * select() (which uses fetchAll under the hood) and yield rows from it.
 */
class D1Connection extends BaseD1Connection
{
    /**
     * Run a select statement against the database and return a generator.
     *
     * @param  string  $query
     * @param  array  $bindings
     * @param  bool  $useReadPdo
     */
    public function cursor($query, $bindings = [], $useReadPdo = true): Generator
    {
        foreach ($this->select($query, $bindings, $useReadPdo) as $row) {
            yield $row;
        }
    }

    /**
     * Cloudflare D1 over HTTP has NO interactive transactions. The renoki-co/l1
     * driver only fakes begin/commit and never overrides rollBack(), so when
     * Nova wraps a create/update in DB::transaction() and anything fails,
     * Laravel calls rollBack() which falls through to the real in-memory SQLite
     * PDO with no active transaction and throws "There is no active
     * transaction" (500) — masking the real error.
     *
     * We make begin/commit/rollBack manage ONLY the internal transaction
     * counter and never touch the underlying PDO.
     */
    public function beginTransaction(): void
    {
        $this->transactions = 1;
    }

    public function commit(): void
    {
        $this->transactions = 0;
    }

    public function rollBack($toLevel = null): void
    {
        $this->transactions = 0;
    }

    public function transactionLevel()
    {
        return $this->transactions ?? 0;
    }
}
