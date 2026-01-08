import React from "react";
import {BottomNavigation, BottomNavigationAction, Card, CardContent, Paper, Typography, useTheme} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PasswordIcon from '@mui/icons-material/Password';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Head from "next/head";

function FeatureCard({title, description, icon}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        margin: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.shadows[4],
        }
      }}
    >
      <CardContent className="text-center">
        {React.cloneElement(icon, {sx: {fontSize: 40, color: theme.vars.palette.primary.main}})}
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
      title: "AI Studio",
      description: "A multi-model AI tool, supporting full control of conversations, Markdown + LaTeX rendering, multimodal input and output, file processing, stream output.",
      icon: <AutoAwesomeIcon/>,
    },
    {
      title: "Password & Encryption Tools",
      description: "Generate secure and customizable passwords by your key.",
      icon: <PasswordIcon/>,
    },
    {
      title: "Markdown Blogs",
      description: "Blogs with Markdown and LaTeX support for personal usage.",
      icon: <EditNoteIcon/>,
    },
  ];

  return (
    <div className="local-scroll-container">
      <Head>
        <title>Windsnow1025</title>
      </Head>
      <div className="local-scroll-scrollable flex-column gap-y-8 p-4">
        {/* Hero Section */}
        <div className="text-center">
          <Typography
            variant="h2"
            color="primary"
            gutterBottom
          >
            Windsnow1025
          </Typography>
          <Typography variant="h5" color="textSecondary">
            Featuring AI Studio and utilities
          </Typography>
        </div>

        {/* Features Grid */}
        <div className="flex-center gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
      <BottomNavigation showLabels>
        <BottomNavigationAction
          label="Email"
          icon={<EmailIcon/>}
          onClick={() => window.location.href = 'mailto:windsnow1025@windsnow1025.com'}
        />
        <BottomNavigationAction
          label="GitHub"
          icon={<GitHubIcon/>}
          onClick={() => window.open('https://github.com/windsnow1025/UniWebPlatform', '_blank')}
        />
        <BottomNavigationAction
          label="Privacy"
          icon={<PolicyIcon/>}
          onClick={() => window.open('/legal/privacy')}
        />
        <BottomNavigationAction
          label="Terms"
          icon={<GavelIcon/>}
          onClick={() => window.open('/legal/terms')}
        />
      </BottomNavigation>
    </div>
  );
}

export default Index;
