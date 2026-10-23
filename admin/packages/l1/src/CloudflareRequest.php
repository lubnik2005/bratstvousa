<?php

namespace RenokiCo\L1;

use Saloon\Http\Request;

abstract class CloudflareRequest extends Request
{
    protected CloudflareConnector $connector;

    public function __construct($connector)
    {
        $this->connector = $connector;
    }

    protected function resolveConnector(): CloudflareConnector
    {
        return $this->connector;
    }
}
