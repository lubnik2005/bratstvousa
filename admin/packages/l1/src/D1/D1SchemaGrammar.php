<?php

namespace RenokiCo\L1\D1;

use Illuminate\Database\Schema\Grammars\SQLiteGrammar;
use Illuminate\Support\Str;

class D1SchemaGrammar extends SQLiteGrammar
{
    public function compileTableExists($schema, $table)
    {
        return sprintf(
            "select exists (select 1 from %s.sqlite_schema where name = %s and type = 'table') as \"exists\"",
            $this->wrapValue($schema ?? 'main'),
            $this->connection->escape($table),
        );
    }

    public function compileDropAllTables($schema = null)
    {
        return Str::of(parent::compileDropAllTables($schema))
            ->replace('sqlite_master', 'sqlite_schema')
            ->__toString();
    }

    public function compileDropAllViews($schema = null)
    {
        return Str::of(parent::compileDropAllViews($schema))
            ->replace('sqlite_master', 'sqlite_schema')
            ->__toString();
    }

    public function compileLegacyTables($schema, $withSize = false)
    {
        return Str::of(parent::compileLegacyTables($schema, false))
            ->replace('sqlite_master', 'sqlite_schema')
            ->__toString();
    }

    public function compileTables($schema, $withSize = false)
    {
        // D1's HTTP API does not expose the local SQLite dbstat virtual table.
        return parent::compileTables($schema, false);
    }

    public function compileViews($schema)
    {
        return Str::of(parent::compileViews($schema))
            ->replace('sqlite_master', 'sqlite_schema')
            ->__toString();
    }
}
