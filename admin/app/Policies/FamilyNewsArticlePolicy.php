<?php

namespace App\Policies;

use App\Models\FamilyNewsArticle;
use App\Models\User;

class FamilyNewsArticlePolicy
{
    /**
     * Determine whether the user can view any family news articles.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view family_news_articles');
    }

    /**
     * Determine whether the user can view a specific family news article.
     */
    public function view(User $user, FamilyNewsArticle $familyNewsArticle): bool
    {
        return $user->hasPermissionTo('view family_news_articles');
    }

    /**
     * Determine whether the user can create family news articles.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create family_news_articles');
    }

    /**
     * Determine whether the user can update the family news article.
     */
    public function update(User $user, FamilyNewsArticle $familyNewsArticle): bool
    {
        return $user->hasPermissionTo('edit family_news_articles');
    }

    /**
     * Determine whether the user can delete the family news article.
     */
    public function delete(User $user, FamilyNewsArticle $familyNewsArticle): bool
    {
        return $user->hasPermissionTo('delete family_news_articles');
    }

    /**
     * Determine whether the user can restore a deleted family news article.
     */
    public function restore(User $user, FamilyNewsArticle $familyNewsArticle): bool
    {
        return $user->hasPermissionTo('delete family_news_articles');
    }

    /**
     * Determine whether the user can permanently delete the family news article.
     */
    public function forceDelete(User $user, FamilyNewsArticle $familyNewsArticle): bool
    {
        return $user->hasPermissionTo('delete family_news_articles');
    }
}
