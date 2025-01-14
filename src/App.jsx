import React, { useState, useEffect } from 'react';
import { 
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  InputAdornment,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Container,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Styles personnalisés
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  boxShadow: theme.shadows[2],
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: theme.spacing(1, 0),
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  '&.Mui-expanded': {
    minHeight: 48,
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const QAWebsite = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching data...');
    fetch(`${process.env.PUBLIC_URL}/public/qa_data.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonData => {
        console.log('Data loaded:', jsonData);
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      });
  }, []);

  const themes = Object.keys(data);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filterQuestions = (questions = []) => {
    return questions.filter(qa => {
      const questionText = qa.question?.toLowerCase() || '';
      const answerText = qa.answer?.toLowerCase() || '';
      return questionText.includes(searchTerm.toLowerCase()) || 
             answerText.includes(searchTerm.toLowerCase());
    });
  };

  // Obtenir toutes les questions filtrées pour la recherche
  const getAllFilteredQuestions = () => {
    return themes.flatMap(theme => 
      filterQuestions(data[theme]).map(qa => ({
        ...qa,
        theme
      }))
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const renderQuestionsList = (questions, showTheme = false) => {
    return questions.map((qa, index) => (
      <Box key={index}>
        <StyledAccordion>
          <StyledAccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography variant="subtitle1" component="h2">
              {qa.question}
            </Typography>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom 
              color="primary"
            >
              {qa.question}
            </Typography>
            <Typography paragraph>
              {qa.answer}
            </Typography>
            {showTheme && (
              <Typography variant="caption" color="text.secondary">
                Catégorie : {qa.theme}
              </Typography>
            )}
          </AccordionDetails>
        </StyledAccordion>
      </Box>
    ));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom color="primary">
          Foire Aux Questions - EXF-SRI
        </Typography>

        {/* Barre de recherche */}
        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher une question..."
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {searchTerm ? (
          // Résultats de recherche
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              Résultats de recherche
            </Typography>
            {renderQuestionsList(getAllFilteredQuestions(), true)}
          </Box>
        ) : (
          // Navigation par onglets
          <Box sx={{ width: '100%' }}>
            <Paper elevation={3} sx={{ mb: 3 }}>
              <AppBar position="static" color="default" elevation={0}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {themes.map((theme) => (
                    <Tab key={theme} label={theme} />
                  ))}
                </Tabs>
              </AppBar>
            </Paper>

            {themes.map((theme, index) => (
              <Box
                key={theme}
                role="tabpanel"
                hidden={activeTab !== index}
                sx={{ mt: 2 }}
              >
                {activeTab === index && (
                  <Box>
                    {renderQuestionsList(filterQuestions(data[theme]))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default QAWebsite;