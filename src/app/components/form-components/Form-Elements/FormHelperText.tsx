import React from "react";
import CardBox from "../../shared/CardBox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FormHelperText = () => {
  return (
    <div>
      <CardBox>
        <h4 className="text-lg font-semibold mb-2">Form Helper Text</h4>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="email3">Your email</Label>
          </div>
          <Input
            id="email3"
            type="email"
            placeholder="name@materialm.com"
            required
            className="form-control mb-2"
          />
          <p>
            <>
              We’ll never share your details. Read our
              <a
                href="#"
                className="ml-1 font-medium text-primary hover:underline dark:text-primary"
              >
                Privacy Policy
              </a>
              .
            </>
          </p>
        </div>
      </CardBox>
    </div>
  );
};

export default FormHelperText;
