import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Chip,
    IconButton,
    Button,
    Tabs,
    Tab,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import MoodIcon from '@mui/icons-material/Mood';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SpaIcon from '@mui/icons-material/Spa';
import PsychologyIcon from '@mui/icons-material/Psychology';

const wellnessArticles = [
    {
        id: 1,
        title: "Understanding Anxiety and Stress Management",
        category: "Mental Health",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
        content: \`Anxiety is a natural response to stress, but when it becomes overwhelming, it can affect our daily lives. Here are some effective strategies to manage anxiety:

1. Practice Deep Breathing
   - Take slow, deep breaths
   - Count to 4 while inhaling
   - Hold for 4 counts
   - Exhale for 4 counts

2. Progressive Muscle Relaxation
   - Start from your toes
   - Gradually work up to your head
   - Tense and relax each muscle group

3. Mindfulness Techniques
   - Focus on the present moment
   - Observe thoughts without judgment
   - Regular meditation practice

4. Lifestyle Changes
   - Regular exercise
   - Healthy sleep schedule
   - Balanced diet
   - Limited caffeine intake\`,
        readTime: "5 min",
        tags: ["anxiety", "stress", "mental health", "self-care"]
    },
    {
        id: 2,
        title: "The Science of Quality Sleep",
        category: "Sleep",
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500",
        content: \`Sleep is essential for our physical and mental well-being. Understanding sleep cycles and creating optimal conditions can significantly improve your sleep quality.

Key Points:
1. Sleep Cycles
   - Each cycle lasts 90-120 minutes
   - Includes light sleep, deep sleep, and REM
   - Complete 4-6 cycles per night

2. Sleep Hygiene Tips
   - Consistent sleep schedule
   - Dark, cool room
   - No screens before bed
   - Relaxing bedtime routine

3. Natural Sleep Aids
   - Chamomile tea
   - Lavender essential oil
   - White noise
   - Meditation\`,
        readTime: "4 min",
        tags: ["sleep", "health", "wellness", "rest"]
    },
    {
        id: 3,
        title: "Mindful Eating Practices",
        category: "Nutrition",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500",
        content: \`Mindful eating is about developing a new relationship with food. It's not just what you eat, but how you eat that matters.

Principles of Mindful Eating:
1. Eat Slowly
   - Chew thoroughly
   - Put down utensils between bites
   - Take time to appreciate flavors

2. Listen to Your Body
   - Eat when hungry
   - Stop when satisfied
   - Recognize emotional eating

3. Choose Nutritious Foods
   - Whole grains
   - Fresh fruits and vegetables
   - Lean proteins
   - Healthy fats\`,
        readTime: "6 min",
        tags: ["nutrition", "mindfulness", "health", "eating"]
    }
];

const WellnessTips = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [bookmarked, setBookmarked] = useState(() => {
        const saved = localStorage.getItem('bookmarkedArticles');
        return saved ? JSON.parse(saved) : [];
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarked));
    }, [bookmarked]);

    const categories = [
        { value: 'all', label: 'All', icon: <SpaIcon /> },
        { value: 'Mental Health', label: 'Mental Health', icon: <PsychologyIcon /> },
        { value: 'Sleep', label: 'Sleep', icon: <MoodIcon /> },
        { value: 'Nutrition', label: 'Nutrition', icon: <RestaurantIcon /> },
        { value: 'Exercise', label: 'Exercise', icon: <FitnessCenterIcon /> }
    ];

    const handleBookmark = (articleId) => {
        if (bookmarked.includes(articleId)) {
            setBookmarked(bookmarked.filter(id => id !== articleId));
        } else {
            setBookmarked([...bookmarked, articleId]);
        }
    };

    const handleShare = (article) => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.content.substring(0, 100) + '...',
                url: window.location.href
            });
        }
    };

    const filteredArticles = wellnessArticles.filter(article =>
        selectedCategory === 'all' || article.category === selectedCategory
    );

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" color="primary">
                    Wellness Tips & Articles
                </Typography>
            </Box>

            <Tabs
                value={selectedCategory}
                onChange={(_, value) => setSelectedCategory(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3 }}
            >
                {categories.map((category) => (
                    <Tab
                        key={category.value}
                        value={category.value}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {category.icon}
                                <Typography sx={{ ml: 1 }}>{category.label}</Typography>
                            </Box>
                        }
                    />
                ))}
            </Tabs>

            <Grid container spacing={3}>
                {filteredArticles.map((article) => (
                    <Grid item xs={12} md={6} key={article.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={article.image}
                                alt={article.title}
                            />
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">
                                        {article.title}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            onClick={() => handleBookmark(article.id)}
                                            color={bookmarked.includes(article.id) ? "primary" : "default"}
                                        >
                                            {bookmarked.includes(article.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                        </IconButton>
                                        <IconButton onClick={() => handleShare(article)}>
                                            <ShareIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        label={article.category}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label={article.readTime}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {article.content.substring(0, 150)}...
                                </Typography>

                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSelectedArticle(article);
                                        setDrawerOpen(true);
                                    }}
                                >
                                    Read More
                                </Button>

                                <Box sx={{ mt: 2 }}>
                                    {article.tags.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Drawer
                anchor={isMobile ? 'bottom' : 'right'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: isMobile ? '100%' : '40%',
                        maxHeight: isMobile ? '80vh' : '100%',
                        p: 3
                    }
                }}
            >
                {selectedArticle && (
                    <>
                        <Typography variant="h5" gutterBottom>
                            {selectedArticle.title}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label={selectedArticle.category}
                                size="small"
                                sx={{ mr: 1 }}
                            />
                            <Chip
                                label={selectedArticle.readTime}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: 'pre-line',
                                mb: 2
                            }}
                        >
                            {selectedArticle.content}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {selectedArticle.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                />
                            ))}
                        </Box>
                    </>
                )}
            </Drawer>
        </Paper>
    );
};

export default WellnessTips;
