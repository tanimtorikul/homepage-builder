import { useState } from "react";
import StudioEditor from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import heroImageComponent from "../grapesComponents/heroImageComponent";
import heroImageBlock from "../blocks/heroImageBlock";
import searchBarBlock from "../blocks/searchBarBlock";
import searchBarComponent from "../grapesComponents/searchBarComponent";

const PageBuilder = () => {
  const [editor, setEditor] = useState(null);
  const navigate = useNavigate();

  // ✅ Save handler
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
      <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Builder</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded"
          >
            Save Template
          </button>
        </div>
      </div>

      {/* StudioEditor */}
      <div className="flex-1 flex">
        <div className="flex-1">
          <StudioEditor
            onEditor={(editor) => {
              setEditor(editor);
              editor.I18n.setLocale("en");

              // Load custom components
              heroImageComponent(editor);
              searchBarComponent(editor)
            }}
            options={{
              theme: "dark",
              ssages: {},

              blocks: {
                default: [heroImageBlock, searchBarBlock],
              },
              pages: false,
              project: {
                type: "web",
                default: {
                  components: '<div class="container"></div>',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;
