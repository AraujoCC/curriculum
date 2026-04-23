import { useDropzone } from "react-dropzone";

interface Props {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export default function ResumeDropzone({ file, onFileSelect }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDropAccepted: (files) => {
      if (files[0]) onFileSelect(files[0]);
    },
  });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
      <input {...getInputProps()} />
      {file ? (
        <p>
          <strong>Arquivo selecionado:</strong> {file.name}
        </p>
      ) : (
        <p>Arraste o curriculo em PDF aqui ou clique para selecionar</p>
      )}
    </div>
  );
}
