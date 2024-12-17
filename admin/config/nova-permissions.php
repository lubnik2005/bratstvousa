<?php

return [
    /*
    |--------------------------------------------------------------------------
    | User model class
    |--------------------------------------------------------------------------
    */

    'user_model' => 'App\Models\User',

    /*
    |--------------------------------------------------------------------------
    | Nova User resource tool class
    |--------------------------------------------------------------------------
    */

    'user_resource' => 'App\Nova\User',

    /*
    |--------------------------------------------------------------------------
    | The group associated with the resource
    |--------------------------------------------------------------------------
    */

    'role_resource_group' => 'Other',

    /*
    |--------------------------------------------------------------------------
    | Database table names
    |--------------------------------------------------------------------------
    | When using the "HasRoles" trait from this package, we need to know which
    | table should be used to retrieve your roles. We have chosen a basic
    | default value but you may easily change it to any table you like.
    */

    'table_names' => [
        'roles' => 'roles',

        'role_permission' => 'role_permission',

        'role_user' => 'role_user',

        'users' => 'users',
    ],

    /*
    |--------------------------------------------------------------------------
    | Application Permissions
    |--------------------------------------------------------------------------
    */
    'permissions' => [
        'view users' => [
            'display_name' => 'View users',
            'description' => 'Can view users',
            'group' => 'User',
        ],

        'create users' => [
            'display_name' => 'Create users',
            'description' => 'Can create users',
            'group' => 'User',
        ],

        'edit users' => [
            'display_name' => 'Edit users',
            'description' => 'Can edit users',
            'group' => 'User',
        ],

        'delete users' => [
            'display_name' => 'Delete users',
            'description' => 'Can delete users',
            'group' => 'User',
        ],

        'view roles' => [
            'display_name' => 'View roles',
            'description' => 'Can view roles',
            'group' => 'Role',
        ],

        'create roles' => [
            'display_name' => 'Create roles',
            'description' => 'Can create roles',
            'group' => 'Role',
        ],

        'edit roles' => [
            'display_name' => 'Edit roles',
            'description' => 'Can edit roles',
            'group' => 'Role',
        ],

        'delete roles' => [
            'display_name' => 'Delete roles',
            'description' => 'Can delete roles',
            'group' => 'Role',
        ],

        // YouthEvents Start
        'view youth_events' => [
            'display_name' => 'View youth events',
            'description' => 'Can view youth events',
            'group' => 'Youth Event',
        ],
        'create youth_events' => [
            'display_name' => 'Create youth events',
            'description' => 'Can create youth events',
            'group' => 'Youth Event',
        ],
        'edit youth_events' => [
            'display_name' => 'Edit youth events',
            'description' => 'Can edit youth events',
            'group' => 'Youth Event',
        ],
        'delete youth_events' => [
            'display_name' => 'Delete youth events',
            'description' => 'Can delete youth events',
            'group' => 'Youth Event',
        ],
        // YouthEvents End

        // YouthNewsArticle Start
        'view youth_news_article' => [
            'display_name' => 'View youth news article',
            'description' => 'Can view youth news article',
            'group' => 'Youth News Article',
        ],
        'create youth_news_article' => [
            'display_name' => 'Create youth news article',
            'description' => 'Can create youth news article',
            'group' => 'Youth News Article',
        ],
        'edit youth_news_article' => [
            'display_name' => 'Edit youth news article',
            'description' => 'Can edit youth news article',
            'group' => 'Youth News Article',
        ],
        'delete youth_news_article' => [
            'display_name' => 'Delete youth news article',
            'description' => 'Can delete youth news article',
            'group' => 'Youth News Article',
        ],
        // YouthNewsArticle End

        // ChildrensEvent Start
        'view childrens_events' => [
            'display_name' => 'View childrens events',
            'description' => 'Can view childrens events',
            'group' => 'Childrens Event',
        ],
        'create childrens_events' => [
            'display_name' => 'Create childrens events',
            'description' => 'Can create childrens events',
            'group' => 'Childrens Event',
        ],
        'edit childrens_events' => [
            'display_name' => 'Edit childrens events',
            'description' => 'Can edit childrens events',
            'group' => 'Childrens Event',
        ],
        'delete childrens_events' => [
            'display_name' => 'Delete childrens events',
            'description' => 'Can delete childrens events',
            'group' => 'Childrens Event',
        ],
        // ChildrensEvent End

        // ChildrensNewsArticle Start
        'view childrens_news_article' => [
            'display_name' => 'View childrens news article',
            'description' => 'Can view childrens news article',
            'group' => 'Childrens News Article',
        ],
        'create childrens_news_article' => [
            'display_name' => 'Create childrens news article',
            'description' => 'Can create childrens news article',
            'group' => 'Childrens News Article',
        ],
        'edit childrens_news_article' => [
            'display_name' => 'Edit childrens news article',
            'description' => 'Can edit childrens news article',
            'group' => 'Childrens News Article',
        ],
        'delete childrens_news_article' => [
            'display_name' => 'Delete childrens news article',
            'description' => 'Can delete childrens news article',
            'group' => 'Childrens News Article',
        ],
        // ChildrensNewsArticle End
    ],

];
