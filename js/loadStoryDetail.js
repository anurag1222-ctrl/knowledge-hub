// Load individual story for story.html page
document.addEventListener('DOMContentLoaded', function() {
    const storyContainer = document.getElementById('story-content');
    const prevButton = document.getElementById('prev-story');
    const nextButton = document.getElementById('next-story');
    
    // Get story ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = parseInt(urlParams.get('id')) || 1;
    
    // Fetch stories and load the requested one
    fetch('data/stories.json')
        .then(response => response.json())
        .then(stories => {
            // Find the requested story
            const story = stories.find(s => s.id === storyId);
            const storyIndex = stories.findIndex(s => s.id === storyId);
            
            if (!story) {
                storyContainer.innerHTML = `
                    <div class="empty-state">
                        <h2>Story Not Found</h2>
                        <p>The requested story could not be found.</p>
                        <a href="stories.html" class="btn btn-primary">Browse All Stories</a>
                    </div>
                `;
                return;
            }
            
            // Render the story
            storyContainer.innerHTML = `
                <div class="story-detail-header">
                    <h1 class="story-detail-title">${story.title}</h1>
                    <div class="story-detail-meta">
                        <span>${formatDate(story.date)}</span>
                        <span>•</span>
                        <span>${story.category}</span>
                        <span>•</span>
                        <span>${story.readTime || '5 min read'}</span>
                    </div>
                </div>
                <div class="story-detail-content">
                    ${story.content || '<p>No content available.</p>'}
                </div>
            `;
            
            // Set up navigation buttons
            if (storyIndex > 0) {
                const prevStory = stories[storyIndex - 1];
                prevButton.href = `story.html?id=${prevStory.id}`;
                prevButton.style.visibility = 'visible';
            } else {
                prevButton.style.visibility = 'hidden';
            }
            
            if (storyIndex < stories.length - 1) {
                const nextStory = stories[storyIndex + 1];
                nextButton.href = `story.html?id=${nextStory.id}`;
                nextButton.style.visibility = 'visible';
            } else {
                nextButton.style.visibility = 'hidden';
            }
        })
        .catch(error => {
            console.error('Error loading story:', error);
            storyContainer.innerHTML = `
                <div class="empty-state">
                    <h2>Error Loading Story</h2>
                    <p>There was an error loading the requested story. Please try again later.</p>
                    <a href="stories.html" class="btn btn-primary">Browse All Stories</a>
                </div>
            `;
        });
});