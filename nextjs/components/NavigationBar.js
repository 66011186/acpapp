import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from "@mui/icons-material/Person";
import useBearStore from "@/store/useBearStore";

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#ff5e15" }}>
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Link href={"/"}>
            <HomeIcon sx={{ color: "#ffffff" }} fontSize="large" />
          </Link>
          
          <Typography
            variant="body1"
            sx={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#ffffff",
              padding: "0 10px",
              fontFamily: "Prompt",
            }}
          >
            {appName}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <NavigationLink href="/page1" label="Water" />
          <Box sx={{ flexGrow: 1 }} />
          <NavigationLink href="/page2" label="Calories" />
          <Box sx={{ flexGrow: 1 }} />
          <NavigationLink href="/page3" label="Exercise" />
  
          <Box sx={{ flexGrow: 1 }} /> {/* This creates space between links and the button */}
  
          <Button
            color="inherit" // Use inherit for better styling
            onClick={() => {
              router.push("/page4");
            }}
          >
            <PersonIcon />
          </Button>
        </Toolbar>
      </AppBar>
      
      <main>{children}</main>
    </>
  );
};

const NavigationLink = ({ href, label }) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          // textTransform: "uppercase",
          color: "#fff",
          padding: "0 10px", // Add padding on left and right
        }}>
        {label}
      </Typography>{" "}
    </Link>
  );
};

export default NavigationLayout;
