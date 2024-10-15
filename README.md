# About DETOXER

**DETOXER** is an open-sourced visual analytics application, that incorporates explorations, interactivity, and explainability, to facilitate a multi-scoped debugging of Temporal Multi-Label Classification (TMLC) Machine Learning models used for video activity recognition. 

Here is a link to the [demo](https://indie.cise.ufl.edu/GlobalVis/).

![DETOXER](https://mahsan.page/static/media/XAI_3.2023b3c0e924b9ebea9b.png)

# Data

We used two sets of videos for our two domains. Kitchen activity videos from **The TACoS Corpus**, licensed and available [here](https://www.coli.uni-saarland.de/projects/smile/page.php?id=tacos) for free. The Wet Lab videos are from [this paper](https://ojs.aaai.org/index.php/AAAI/article/view/8939). Please contact the authors for permission to use.

The TMLC model is not included; however, the outputs of the model for activity recognition within the videos are available in `scr/data/`.

`scr/data/`:
- `dset.json` & `dset-wetlab.json` provide model-generated information used in the global information panel on the right for the cooking and wet lab datasets, respectively.
- `vocabulary.json` & `vocabulary-wetlab.json` list all the labels/classes used for classification for each of the datasets.
- `probs.s*-d*.mp4.json` & `probs.{CELL|LLGM|YPAD}*.mp4.json` provide the model-generated probabilities per video used for creating the heatmaps for cooking and wet lab datasets, respectively.

# Technology
For this web-based application, we used [React.js](https://react.dev/) as the Javascript framework, and [Material UI (MUI)](https://mui.com/) as the CSS styling framework. 
We utilize [D3.js](https://d3js.org) to draw SVG elements. 

# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
To run the demo in this repository, use `npm install` and start a development server via `npm start`. A list of available commands can be found below.

## Available Commands
### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Additional Information
If you use this library, showcase its results, or want to refer to it, please cite [our paper](https://ieeexplore.ieee.org/abstract/document/9866547). The supplemental material for our paper, including an extended case study and usage video, can be found [here](https://ieeexplore.ieee.org/document/9866547/media#media).

```
@article{nourani2022detoxer,
  title={DETOXER: a visual debugging tool with multiscope explanations for temporal multilabel classification},
  author={Nourani, Mahsan and Roy, Chiradeep and Honeycutt, Donald R and Ragan, Eric D and Gogate, Vibhav},
  journal={IEEE Computer Graphics and Applications},
  volume={42},
  number={6},
  pages={37--46},
  year={2022},
  publisher={IEEE},
  doi: {10.1109/MCG.2022.3201465}
}
```

# License

Distributed under the MIT License. See `LICENSE` for more information.

# Contact

Mahsan Nourani - m.nourani@northeastern.edu
