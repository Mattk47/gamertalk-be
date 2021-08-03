exports.formatCategoryData = (categoryData) => {
    if (!categoryData || categoryData.length === 0) return []
    const result = categoryData.map((category) => {
        return [
            category.slug,
            category.description
        ]
    })
    return result;
}

exports.formatUserData = (userData) => {
    if (!userData || userData.length === 0) return []
    const result = userData.map((user) => {
        return [
            user.username,
            user.name,
            user.avatar_url,
        ]
    })
    return result;
}

exports.formatReviewData = (reviewData) => {
    if (!reviewData || reviewData.length === 0) return []
    const result = reviewData.map((review) => {
        return [
            review.title,
            review.review_body,
            review.designer,
            review.review_image_url,
            review.votes,
            review.category,
            review.owner,
            review.created_at
        ]
    })
    return result;
}