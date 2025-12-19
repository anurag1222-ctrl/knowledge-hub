// Load stories for stories.html page
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('stories-container');
    const searchInput = document.getElementById('story-search');
    const filterSelect = document.getElementById('story-filter');
    const noResults = document.getElementById('no-stories-found');
    
    let allStories = [];
    let filteredStories = [];
    
    // Fetch stories from JSON
    fetch('data/stories.json')
        .then(response => response.json())
        .then(stories => {
            allStories = stories;
            filteredStories = [...stories];
            renderStories();
            
            // Show container, hide loading/empty state
            if (container) container.style.display = 'grid';
            if (noResults) noResults.style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading stories:', error);
            if (container) container.innerHTML = '<p class="empty-state">Error loading stories. Please try again later.</p>';
        });
    
    // Render stories to the page
    function renderStories() {
        if (!container) return;
        
        container.innerHTML = '';
        
        if (filteredStories.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        
        filteredStories.forEach(story => {
            const storyCard = document.createElement('article');
            storyCard.className = 'story-card';
            storyCard.innerHTML = `
                <div class="story-image">
                    <i class="fas fa-${story.icon || 'book-open'}"></i>
                </div>
                <div class="story-content">
                    <h2 class="story-title">${story.title}</h2>
                    <div class="card-meta">
                        <span>${formatDate(story.date)}</span>
                        <span>•</span>
                        <span>${story.readTime || '5 min read'}</span>
                    </div>
                    <p class="story-excerpt">${story.excerpt}</p>
                    <div class="story-meta">
                        <span class="card-category">${story.category}</span>
                        <a href="story.html?id=${story.id}" class="btn btn-outline">Read</a>
                    </div>
                </div>
            `;
            container.appendChild(storyCard);
        });
    }
    
    // Filter stories based on search and category
    function filterStories() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = filterSelect.value;
        
        filteredStories = allStories.filter(story => {
            const matchesSearch = story.title.toLowerCase().includes(searchTerm) ||
                                 story.excerpt.toLowerCase().includes(searchTerm) ||
                                 story.content.toLowerCase().includes(searchTerm);
            
            const matchesCategory = category === 'all' || story.category.toLowerCase() === category;
            
            return matchesSearch && matchesCategory;
        });
        
        renderStories();
    }
    
    // Event listeners for search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterStories);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterStories);
    }
});