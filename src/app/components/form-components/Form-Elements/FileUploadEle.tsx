import { Label } from "@/components/ui/label";
import CardBox from "../../shared/CardBox";
import { Input } from "@/components/ui/input";

const FileUploadEle = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">File Upload</h4>
        <div id="fileUpload" className="max-w-md pb-[6.625rem]">
          <div className="mb-2 block">
            <Label htmlFor="file">Upload file</Label>
          </div>
          <Input id="file" type="file" />
          <p className="mt-2">
            A profile picture is useful to confirm your are logged into your
            account
          </p>
        </div>
      </CardBox>
    </div>
  );
};

export default FileUploadEle;
