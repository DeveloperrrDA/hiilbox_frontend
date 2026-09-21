import React from "react";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TextAreaEle = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Textarea element</h4>
        <div className="max-w-md ">
          <div className="mb-2 block">
            <Label htmlFor="comment">Your message</Label>
          </div>
          <Textarea
            id="comment"
            placeholder="Leave a comment..."
            required
            rows={8}
            className="form-control-textarera"
          />
        </div>
      </CardBox>
    </div>
  );
};

export default TextAreaEle;
