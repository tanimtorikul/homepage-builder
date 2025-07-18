import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudioEditor from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import { toast } from "react-hot-toast";

import { googleFontsAssetProvider } from "@grapesjs/studio-sdk-plugins";

import heroImageComponent from "../grapesComponents/heroImageComponent";
import searchBarComponent from "../grapesComponents/searchBarComponent";
import latestNewsComponent from "../grapesComponents/latestNewsComponent";
import whyChooseUsComponent from "../grapesComponents/whyChooseUsComponent";

import heroImageBlock from "../blocks/heroImageBlock";
import searchBarBlock from "../blocks/searchBarBlock";
import latestNewsBlock from "../blocks/latestNewsBlock";
import searchHeadingText from "../blocks/searchHeadingText";
import whyChooseUsBlock from "../blocks/whyChooseUsBlock";

const PageBuilder = () => {
  const [editor, setEditor] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!editor) return;
    const projectData = await editor.getProjectData();
    localStorage.setItem("product-template-json", JSON.stringify(projectData));
    toast.success("Template JSON saved!");
    navigate("/home");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="p-2 bg-gray-100 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Builder</h1>
        <button
          onClick={handleSave}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded"
        >
          Save Template
        </button>
      </header>

      {/* Editor */}
      <div className="flex-1 flex">
        <StudioEditor
          onEditor={(editorInstance) => {
            setEditor(editorInstance);
            editorInstance.I18n.setLocale("en");

            // Load custom components
            heroImageComponent(editorInstance);
            searchBarComponent(editorInstance);
            latestNewsComponent(editorInstance);
            whyChooseUsComponent(editorInstance);
          }}
          options={{
            theme: "dark",
            fonts: {
              enableFontManager: true,
              loadGoogleFonts: true,
            },
            plugins: [
              googleFontsAssetProvider.init({
                apiKey: "AIzaSyBu8ZO9iIW_qTQaet7QqK-y60pyaZ-sOO0",
              }),
              (editor) => {
                editor.onReady(() => {
                  const textCmp = editor.getWrapper().find("p")[0];
                  editor.select(textCmp);
                });
              },
            ],
            blocks: {
              default: [
                heroImageBlock,
                searchBarBlock,
                latestNewsBlock,
                searchHeadingText,
                whyChooseUsBlock,
              ],
            },
            project: {
              type: "web",
              default: {
                pages: [
                  {
                    name: "Home",
                    component: `
                      <p>Open the Typography panel on the right → Font → "+" → Choose a Google Font</p>
                    `,
                  },
                ],
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PageBuilder;
