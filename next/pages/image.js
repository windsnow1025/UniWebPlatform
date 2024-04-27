import '../src/asset/css/index.css';
import useThemeHandler from "../app/hooks/useThemeHandler";
import React, {useEffect, useState} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {
  Button,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider
} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import ContentDiv from "../app/components/message/ContentDiv";
import ImageService from "../src/service/ImageService";

function Image() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Image Generate";

  useEffect(() => {
    document.title = title;
  }, []);

  const [model, setModel] = useState("dall-e-3");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("standard");
  const [n, setN] = useState(1);

  const [prompt, setPrompt] = useState("");

  const [imageUrls, setImageUrls] = useState([]);

  const imageService = new ImageService();

  const handleGenerate = async () => {
    try {
      const response = await imageService.generate(prompt, model, size, quality, n);
      setImageUrls(response);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      {muiTheme &&
        <ThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme/>
          <HeaderAppBar
            title={title}
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
          <div className="flex-around m-2">
            <div className="m-1">
              <FormControl fullWidth className="mt-2">
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  value={model}
                  label="Model"
                  onChange={e => setModel(e.target.value)}
                >
                  <MenuItem value="dall-e-3">DALL·E 3</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="m-1">
              <FormControl fullWidth className="mt-2">
                <InputLabel id="size-select-label">Size</InputLabel>
                <Select
                  labelId="size-select-label"
                  id="size-select"
                  value={size}
                  label="Size"
                  onChange={e => setSize(e.target.value)}
                >
                  <MenuItem value="1024x1024">1024x1024</MenuItem>
                  <MenuItem value="1792x1024">1792x1024</MenuItem>
                  <MenuItem value="1024x1792">1024x1792</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="m-1">
              <FormControl fullWidth className="mt-2">
                <InputLabel id="quality-select-label">Quality</InputLabel>
                <Select
                  labelId="quality-select-label"
                  id="quality-select"
                  value={quality}
                  label="Quality"
                  onChange={e => setQuality(e.target.value)}
                >
                  <MenuItem value="standard">standard</MenuItem>
                  <MenuItem value="hd">hd</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="m-1">
              <InputLabel htmlFor="temperature">Amount: {n}</InputLabel>
              <Slider
                aria-label="Amount"
                value={n}
                onChange={(e, newValue) => setN(newValue)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={1}
              />
            </div>
          </div>
          <Paper elevation={1} className="m-2 p-4 rounded-lg">
            <ContentDiv
              contentInitial={prompt}
              onContentChange={setPrompt}
            />
          </Paper>
          <div className="flex-center">
            <div className="m-2">
              <Button id="generate" variant="contained" onClick={handleGenerate}>Generate</Button>
            </div>
          </div>
          <div className="flex-around">
            {imageUrls.map((imageUrl, index) => (
              <div key={index}>
                <picture>
                  <img
                    key={index}
                    src={imageUrl}
                    alt="imageUrl"
                    className="max-w-full"
                  />
                </picture>
              </div>
            ))}
          </div>
        </ThemeProvider>
      }
    </>
  );
}

export default Image;