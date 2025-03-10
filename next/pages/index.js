'use client';

import React, {useEffect} from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Link,
  Typography,
  useTheme
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import ChatIcon from "@mui/icons-material/Chat";
import BookIcon from "@mui/icons-material/Book";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import PasswordIcon from "@mui/icons-material/Password";
import ImageIcon from "@mui/icons-material/Image";
import useThemeHandler from "../app/hooks/useThemeHandler";
import HeaderAppBar from "../app/components/common/header/HeaderAppBar";

function FeatureCard({title, description, icon}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.shadows[4],
        }
      }}
    >
      <CardContent sx={{flexGrow: 1, textAlign: 'center'}}>
        {React.cloneElement(icon, {sx: {fontSize: 40, mb: 2, color: theme.palette.primary.main}})}
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Index() {
  const features = [
    {
      title: "AI Chat",
      description: "Engage in intelligent conversations with our advanced AI chatbot",
      icon: <ChatIcon/>
    },
    {
      title: "Markdown Blogs",
      description: "Create and share your thoughts with our markdown-based blog system",
      icon: <BookIcon/>
    },
    {
      title: "Bookmarks",
      description: "Organize and manage your favorite web links efficiently",
      icon: <BookmarksIcon/>
    },
    {
      title: "Password Generator",
      description: "Generate secure and customizable passwords",
      icon: <PasswordIcon/>
    },
    {
      title: "AI Image Generator",
      description: "Create unique images using artificial intelligence",
      icon: <ImageIcon/>
    }
  ];

  useEffect(() => {
    document.title = "UniWebPlatform";
  }, []);

  return (
    <div className="local-scroll-root">
      <HeaderAppBar title="Home Page"/>
      <div className="local-scroll-scrollable flex-around m-2">
        <Container maxWidth="xl" className="py-4">
          {/* Hero Section */}
          <Box className="text-center mb-8">
            <Typography
              variant="h2"
              color="primary"
              gutterBottom
            >
              UniWebPlatform
            </Typography>
            <Typography variant="h5" color="textSecondary">
              A modern full-stack web platform featuring AI-powered tools and utilities
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={4} className="mb-8">
            {features.map((feature, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>

          {/* Contact Section */}
          <Box className="text-center mt-8">
            <Typography variant="h4" gutterBottom color="primary">
              Connect With Me
            </Typography>
            <Box className="flex justify-center space-x-6 mt-4">
              <Link
                href="mailto:windsnow1024@gmail.com"
                className="flex items-center space-x-2 hover:opacity-80"
                color="inherit"
              >
                <EmailIcon/>
                <Typography>Email</Typography>
              </Link>
              <Link
                href="https://github.com/windsnow1025/UniWebPlatform"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-80"
                color="inherit"
              >
                <GitHubIcon/>
                <Typography>GitHub</Typography>
              </Link>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default Index;
