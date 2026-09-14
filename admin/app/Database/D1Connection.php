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
}
