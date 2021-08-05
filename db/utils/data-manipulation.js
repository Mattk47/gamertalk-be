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
            review.review_img_url,
            review.votes,
            review.category,
            review.owner,
            review.created_at
        ]
    })
    return result;
}

exports.createReviewRef = (reviewRows) => {
    if (reviewRows.length === 0) return {}
    const reviewRef = {};
    reviewRows.forEach((reviewRow) => {
        reviewRef[reviewRow.title] = reviewRow.review_id
    });
    return reviewRef;
};

exports.formatCommentData = (commentData, reviewRef) => {
    if (commentData.length === 0) return [];
    return commentData.map((comment) => {
        const { body, belongs_to, created_by, votes, created_at } = comment
        return [created_by, reviewRef[belongs_to], votes, created_at, body]
    })
}