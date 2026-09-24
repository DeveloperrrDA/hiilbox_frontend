import React from "react";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FileUploadSizings = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">File Upload Sizing</h4>
        <div>
          <div className="my-5">
            <div className="pb-2">
              <Label htmlFor="small-file-upload">Small file input</Label>
            </div>
            <Input id="small-file-upload" type="file" />
          </div>
          <div className="mb-5">
            <div className="pb-2">
              <Label htmlFor="default-file-upload">
                Default size file input
              </Label>
            </div>
            <Input id="default-file-upload" type="file" />
          </div>
          <div>
            <div className="pb-2">
              <Label htmlFor="large-file-upload">Large file input</Label>
            </div>
            <Input id="large-file-upload" type="file" />
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default FileUploadSizings;
