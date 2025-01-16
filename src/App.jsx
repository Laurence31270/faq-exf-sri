import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Box,
  Collapse,
  TextField,
  InputAdornment,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import {
  MenuBook as BookIcon,
  Description as FileIcon,
  Settings as SettingsIcon,
  People as UsersIcon,
  Security as ShieldIcon,
  Storage as DatabaseIcon,
  Code as CodeIcon,
  Archive as BoxIcon,
  Email as MailIcon,
  Phone as PhoneIcon,
  QuestionAnswer as QuestionIcon
} from '@mui/icons-material';

// Couleurs pastel harmonieuses
const THEME_COLORS = [
  '#F0C5E6', // Rose pastel
  '#CDF0C5', // Vert pastel
  '#8BAFD6', // Bleu pastel
  '#99D68B', // Vert clair
  '#D6C58B', // Beige
  '#C5D6F0', // Bleu clair
  '#F0D6C5', // Pêche
  '#D68BA4', // Rose saumon
  '#8BD6D6', // Turquoise
  '#BAB8F0'  // Lavande
];

// Styles personnalisés
const StyledCard = styled(Card)(({ theme, index, isExpanded }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: isExpanded ? 'transparent' : THEME_COLORS[index % THEME_COLORS.length],
  position: isExpanded ? 'fixed' : 'relative',
  top: isExpanded ? '0' : 'auto',
  left: isExpanded ? '0' : 'auto',
  right: isExpanded ? '0' : 'auto',
  bottom: isExpanded ? '0' : 'auto',
  zIndex: isExpanded ? 1300 : 1,
  width: isExpanded ? '100%' : 'auto',
  height: isExpanded ? '100vh' : '100%',
  overflow: 'auto',
  '&:hover': {
    transform: isExpanded ? 'none' : 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  zIndex: 1400,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme, depth = 0 }) => ({
  paddingLeft: theme.spacing(2 * (depth + 1)),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const QAWebsite = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedSubtheme, setSelectedSubtheme] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Liste d'icônes disponibles
  const availableIcons = [
    BookIcon, FileIcon, SettingsIcon, UsersIcon, ShieldIcon,
    DatabaseIcon, CodeIcon, BoxIcon, MailIcon, PhoneIcon
  ];

  const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * availableIcons.length);
    const IconComponent = availableIcons[randomIndex];
    return <IconComponent />;
  };

  useEffect(() => {
    fetch('./qa_data.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(jsonData => {
        const processedData = Object.entries(jsonData).reduce((acc, [theme, themeData]) => {
          acc[theme] = Object.entries(themeData).reduce((subAcc, [subtheme, subthemeData]) => {
            const subthemeName = Object.keys(subthemeData).length === 0 && Object.keys(themeData).length > 1 ? "Autres" : subtheme;
            if (subthemeName !== "Autres" || Object.keys(themeData).length === 1) {
              subAcc[subthemeName] = Object.entries(subthemeData).reduce((chapAcc, [chapter, questions]) => {
                if (questions.length === 0) {
                  chapAcc[chapter] = [{ question: "Divers", answer: "" }];
                } else {
                  chapAcc[chapter] = questions;
                }
                return chapAcc;
              }, {});
            }
            return subAcc;
          }, {});
          return acc;
        }, {});
        
        setData(processedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (expandedCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [expandedCard]);

  const handleCardExpand = (theme) => {
    if (expandedCard === theme) {
      setExpandedCard(null);
      setSelectedTheme(null);
      setSelectedSubtheme(null);
    } else {
      setExpandedCard(theme);
      setSelectedTheme(theme);
    }
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubthemeClick = (subtheme) => {
    setSelectedSubtheme(subtheme === selectedSubtheme ? null : subtheme);
  };

  const filterQuestions = (questions = []) => {
    return questions.filter(qa => {
      const questionText = qa.question?.toLowerCase() || '';
      const answerText = qa.answer?.toLowerCase() || '';
      return questionText.includes(searchTerm.toLowerCase()) || 
             answerText.includes(searchTerm.toLowerCase());
    });
  };

  const renderSearchResults = () => {
    const results = [];
    Object.entries(data).forEach(([theme, themeData]) => {
      const themeResults = [];
      let hasResults = false;
      
      Object.entries(themeData).forEach(([subtheme, subthemeData]) => {
        const subthemeResults = [];
        
        Object.entries(subthemeData).forEach(([chapter, questions]) => {
          const filteredQuestions = filterQuestions(questions);
          if (filteredQuestions.length > 0) {
            hasResults = true;
            subthemeResults.push(
              <Box key={chapter} sx={{ ml: 4, mb: 2 }}>
                {chapter !== "Sans chapitre" && (
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {chapter}
                  </Typography>
                )}
                <List>
                  {filteredQuestions.map((qa, index) => {
                    const questionId = `${theme}-${subtheme}-${chapter}-${index}`;
                    return (
                      <StyledListItem 
                        key={questionId}
                        button
                        onClick={() => toggleQuestion(questionId)}
                      >
                        <ListItemIcon>
                          <QuestionIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={qa.question}
                          secondary={
                            <Collapse in={expandedQuestions[questionId]}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                              >
                                {qa.answer}
                              </Typography>
                            </Collapse>
                          }
                        />
                        {expandedQuestions[questionId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </StyledListItem>
                    );
                  })}
                </List>
              </Box>
            );
          }
        });
        
        if (subthemeResults.length > 0) {
          themeResults.push(
            <Box key={subtheme} sx={{ ml: 2, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                {subtheme}
              </Typography>
              {subthemeResults}
            </Box>
          );
        }
      });
      
      if (hasResults) {
        results.push(
          <Card 
            key={theme} 
            sx={{ 
              mb: 4, 
              p: 2,
              backgroundColor: 'white',
              border: `2px solid ${THEME_COLORS[Object.keys(data).indexOf(theme) % THEME_COLORS.length]}`,
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3,
                color: THEME_COLORS[Object.keys(data).indexOf(theme) % THEME_COLORS.length],
              }}
            >
              {theme}
            </Typography>
            {themeResults}
          </Card>
        );
      }
    });
    
    return results;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </Box>
    );
  }

  return (
    <Box sx={{ overflowY: 'auto', height: '100vh' }}>
      {/* Bandeau fixe en haut */}
      <AppBar position="fixed" sx={{ zIndex: 1400 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => {
              setExpandedCard(null);
              setSelectedTheme(null);
              setSelectedSubtheme(null);
            }}
          >
            Foire Aux Questions - EXF-SRI
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: '300px',
              backgroundColor: 'white',
              borderRadius: '4px',
              marginLeft: '16px',
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Menu des thèmes */}
      <Drawer
        anchor="left"
        open={showMenu}
        onClose={() => setShowMenu(false)}
        sx={{ zIndex: 1300 }}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Thèmes
          </Typography>
          <List>
            {Object.keys(data).map((theme, index) => (
              <ListItem
                button
                key={theme}
                onClick={() => {
                  handleCardExpand(theme);
                  setShowMenu(false);
                }}
                sx={{
                  backgroundColor: expandedCard === theme ? THEME_COLORS[index % THEME_COLORS.length] : 'transparent',
                  '&:hover': {
                    backgroundColor: THEME_COLORS[index % THEME_COLORS.length],
                  },
                }}
              >
                <ListItemText primary={theme} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Contenu principal */}
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        {searchTerm ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Résultats de recherche
            </Typography>
            {renderSearchResults()}
          </Box>
        ) : (
          <Box>
            {expandedCard ? (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: THEME_COLORS[Object.keys(data).indexOf(expandedCard) % THEME_COLORS.length],
                    mb: 3,
                  }}
                >
                  {expandedCard}
                </Typography>
                {Object.keys(data[expandedCard]).map((subtheme) => (
                  <Box key={subtheme} sx={{ mb: 4 }}>
                    {Object.keys(data[expandedCard][subtheme]).length === 0 ? (
                      <List>
                        {data[expandedCard][subtheme].map((qa, index) => {
                          const questionId = `${expandedCard}-${subtheme}-${index}`;
                          return (
                            <StyledListItem
                              key={questionId}
                              button
                              onClick={() => toggleQuestion(questionId)}
                            >
                              <ListItemIcon>
                                <QuestionIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={qa.question}
                                secondary={
                                  <Collapse in={expandedQuestions[questionId]}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 1 }}
                                    >
                                      {qa.answer}
                                    </Typography>
                                  </Collapse>
                                }
                              />
                              {expandedQuestions[questionId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </StyledListItem>
                          );
                        })}
                      </List>
                    ) : (
                      <>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            mb: 2, 
                            color: 'text.primary',
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubthemeClick(subtheme);
                          }}
                        >
                          {subtheme}
                        </Typography>
                        <Collapse in={selectedSubtheme === subtheme}>
                          {Object.entries(data[expandedCard][subtheme]).map(([chapter, questions]) => (
                            <Box key={chapter} sx={{ ml: 2, mb: 3 }}>
                              {chapter !== "Sans chapitre" && (
                                <Typography 
                                  variant="h6" 
                                  color="primary" 
                                  sx={{ 
                                    mb: 1,
                                    cursor: 'pointer',
                                    '&:hover': { opacity: 0.8 }
                                  }}
                                >
                                  {chapter}
                                </Typography>
                              )}
                              <List>
                                {questions.map((qa, index) => {
                                  const questionId = `${expandedCard}-${subtheme}-${chapter}-${index}`;
                                  return (
                                    <StyledListItem
                                      key={questionId}
                                      button
                                      onClick={() => toggleQuestion(questionId)}
                                    >
                                      <ListItemIcon>
                                        <QuestionIcon color="primary" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={qa.question}
                                        secondary={
                                          <Collapse in={expandedQuestions[questionId]}>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                              sx={{ mt: 1 }}
                                            >
                                              {qa.answer}
                                            </Typography>
                                          </Collapse>
                                        }
                                      />
                                      {expandedQuestions[questionId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </StyledListItem>
                                  );
                                })}
                              </List>
                            </Box>
                          ))}
                        </Collapse>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {Object.keys(data).map((theme, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    key={theme}
                    sx={{ position: 'relative' }}
                  >
                    <StyledCard 
                      onClick={() => handleCardExpand(theme)}
                      index={index}
                      isExpanded={expandedCard === theme}
                    >
                      <CardHeader
                        avatar={getRandomIcon()}
                        title={
                          <Typography 
                            variant="h6"
                            sx={{ 
                              color: 'rgba(0, 0, 0, 0.87)',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {theme}
                          </Typography>
                        }
                      />
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default QAWebsite;