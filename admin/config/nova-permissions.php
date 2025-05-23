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
        // ChildrensFiles start
        'view childrens_files' => [
            'display_name' => 'View childrens files',
            'description' => 'Can view childrens files',
            'group' => 'Childrens Files',
        ],
        'create childrens_files' => [
            'display_name' => 'Create childrens files',
            'description' => 'Can create childrens files',
            'group' => 'Childrens Files',
        ],
        'edit childrens_files' => [
            'display_name' => 'Edit childrens files',
            'description' => 'Can edit childrens files',
            'group' => 'Childrens Files',
        ],
        'delete childrens_files' => [
            'display_name' => 'Delete childrens files',
            'description' => 'Can delete childrens files',
            'group' => 'Childrens Files',
        ],
        // ChildrensFiles End
        // ChildrensFileCategory Start
        'view childrens_file_category' => [
            'display_name' => 'View childrens file category',
            'description' => 'Can view childrens file category',
            'group' => 'Childrens File Category',
        ],
        'create childrens_file_category' => [
            'display_name' => 'Create childrens file category',
            'description' => 'Can create childrens file category',
            'group' => 'Childrens File Category',
        ],
        'edit childrens_file_category' => [
            'display_name' => 'Edit childrens file category',
            'description' => 'Can edit childrens file category',
            'group' => 'Childrens File Category',
        ],
        'delete childrens_file_category' => [
            'display_name' => 'Delete childrens file category',
            'description' => 'Can delete childrens file category',
            'group' => 'Childrens File Category',
        ],
        // ChildrensFileCategory End
        // NewsArticles Start
        'view news_articles' => [
            'display_name' => 'View news articles',
            'description' => 'Can view news articles',
            'group' => 'News Articles',
        ],
        'create news_articles' => [
            'display_name' => 'Create news articles',
            'description' => 'Can create news articles',
            'group' => 'News Articles',
        ],
        'edit news_articles' => [
            'display_name' => 'Edit news articles',
            'description' => 'Can edit news articles',
            'group' => 'News Articles',
        ],
        'delete news_articles' => [
            'display_name' => 'Delete news articles',
            'description' => 'Can delete news articles',
            'group' => 'News Articles',
        ],

        // NewsArticles End
        // BibleEducationEvent Start
        'view bible_education_events' => [
            'display_name' => 'View Bible education events',
            'description' => 'Can view Bible education events',
            'group' => 'Bible Education Events',
        ],
        'create bible_education_events' => [
            'display_name' => 'Create Bible education events',
            'description' => 'Can create Bible education events',
            'group' => 'Bible Education Events',
        ],
        'edit bible_education_events' => [
            'display_name' => 'Edit Bible education events',
            'description' => 'Can edit Bible education events',
            'group' => 'Bible Education Events',
        ],
        'delete bible_education_events' => [
            'display_name' => 'Delete Bible education events',
            'description' => 'Can delete Bible education events',
            'group' => 'Bible Education Events',
        ],
        // BibleEducationEvent End

        // Churches Start
        'view churches' => [
            'display_name' => 'View churches',
            'description' => 'Can view churches',
            'group' => 'Churches',
        ],
        'create churches' => [
            'display_name' => 'Create churches',
            'description' => 'Can create churches',
            'group' => 'Churches',
        ],
        'edit churches' => [
            'display_name' => 'Edit churches',
            'description' => 'Can edit churches',
            'group' => 'Churches',
        ],
        'delete churches' => [
            'display_name' => 'Delete churches',
            'description' => 'Can delete churches',
            'group' => 'Churches',
        ],

        // Churches End

        // Gospel Events Start
        'view gospel_events' => [
            'display_name' => 'View gospel events',
            'description' => 'Can view gospel events',
            'group' => 'Gospel Events',
        ],
        'create gospel_events' => [
            'display_name' => 'Create gospel events',
            'description' => 'Can create gospel events',
            'group' => 'Gospel Events',
        ],
        'edit gospel_events' => [
            'display_name' => 'Edit gospel events',
            'description' => 'Can edit gospel events',
            'group' => 'Gospel Events',
        ],
        'delete gospel_events' => [
            'display_name' => 'Delete gospel events',
            'description' => 'Can delete gospel events',
            'group' => 'Gospel Events',
        ],
        // Gospel Events end

        // Family Events start
        'view family_events' => [
            'display_name' => 'View family events',
            'description' => 'Can view family events',
            'group' => 'Family Events',
        ],
        'create family_events' => [
            'display_name' => 'Create family events',
            'description' => 'Can create family events',
            'group' => 'Family Events',
        ],
        'edit family_events' => [
            'display_name' => 'Edit family events',
            'description' => 'Can edit family events',
            'group' => 'Family Events',
        ],
        'delete family_events' => [
            'display_name' => 'Delete family events',
            'description' => 'Can delete family events',
            'group' => 'Family Events',
        ],

        // Family Events end

        // Music Events Start
        'view music_events' => [
            'display_name' => 'View music events',
            'description' => 'Can view music events',
            'group' => 'Music Events',
        ],
        'create music_events' => [
            'display_name' => 'Create music events',
            'description' => 'Can create music events',
            'group' => 'Music Events',
        ],
        'edit music_events' => [
            'display_name' => 'Edit music events',
            'description' => 'Can edit music events',
            'group' => 'Music Events',
        ],
        'delete music_events' => [
            'display_name' => 'Delete music events',
            'description' => 'Can delete music events',
            'group' => 'Music Events',
        ],
        // Music Events end

        // General Events start
        'view general_events' => [
            'display_name' => 'View general events',
            'description' => 'Can view general events',
            'group' => 'General Events',
        ],
        'create general_events' => [
            'display_name' => 'Create general events',
            'description' => 'Can create general events',
            'group' => 'General Events',
        ],
        'edit general_events' => [
            'display_name' => 'Edit general events',
            'description' => 'Can edit general events',
            'group' => 'General Events',
        ],
        'delete general_events' => [
            'display_name' => 'Delete general events',
            'description' => 'Can delete general events',
            'group' => 'General Events',
        ],
        // General Events end
        // form submissions Start
        // form submissions Permissions
        'view form_submissions' => [
            'display_name' => 'View form submissions',
            'description' => 'Can view form submissions',
            'group' => 'Form Submissions',
        ],
        'create form_submissions' => [
            'display_name' => 'Create form submissions',
            'description' => 'Can create form submissions',
            'group' => 'Form Submissions',
        ],
        'edit form_submissions' => [
            'display_name' => 'Edit form submissions',
            'description' => 'Can edit form submissions',
            'group' => 'Form Submissions',
        ],
        'delete form_submissions' => [
            'display_name' => 'Delete form submissions',
            'description' => 'Can delete form submissions',
            'group' => 'Form Submissions',
        ],
        // form submissions End

        // Family News Articles Permissions
        'view family_news_articles' => [
            'display_name' => 'View family news articles',
            'description' => 'Can view family news articles',
            'group' => 'Family News Articles',
        ],
        'create family_news_articles' => [
            'display_name' => 'Create family news articles',
            'description' => 'Can create family news articles',
            'group' => 'Family News Articles',
        ],
        'edit family_news_articles' => [
            'display_name' => 'Edit family news articles',
            'description' => 'Can edit family news articles',
            'group' => 'Family News Articles',
        ],
        'delete family_news_articles' => [
            'display_name' => 'Delete family news articles',
            'description' => 'Can delete family news articles',
            'group' => 'Family News Articles',
        ],
    ],
];
