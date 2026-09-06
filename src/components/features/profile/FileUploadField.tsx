import { FileCheck, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadFieldProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  previewAlt: string;
  placeholderTitle: string;
  placeholderHelper: string;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

export function FileUploadField({
  id,
  label,
  required,
  value,
  previewAlt,
  placeholderTitle,
  placeholderHelper,
  onFileSelected,
  onRemove,
}: FileUploadFieldProps) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-bold text-[#171717]">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-[#F7F4EE] p-3">
          <div className="flex items-center gap-3">
            <img
              src={value}
              alt={previewAlt}
              className="h-12 w-16 rounded-xl border border-zinc-200 object-cover"
            />
            <div>
              <span className="flex items-center gap-1 text-xs font-bold text-[#171717]">
                <FileCheck className="h-3.5 w-3.5 text-[#6B7B4F]" />
                {previewAlt} Terlampir
              </span>
              <span className="text-[10px] text-[#78766B]">Siap diverifikasi tim DaurNusa</span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 cursor-pointer rounded-lg text-[#8A8778] hover:bg-white hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Label
          htmlFor={id}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-[#F7F4EE]/50 p-4 text-center transition-colors hover:border-[#7A8F5C] hover:bg-[#F7F4EE]"
        >
          <UploadCloud className="mb-1.5 h-6 w-6 text-[#7A8F5C]" />
          <span className="text-xs font-bold text-[#171717]">{placeholderTitle}</span>
          <span className="mt-0.5 text-[10px] font-normal text-[#8A8778]">{placeholderHelper}</span>
          <Input
            id={id}
            type="file"
            accept="image/*"
            required={required}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelected(file);
            }}
            className="hidden"
          />
        </Label>
      )}
    </div>
  );
}
