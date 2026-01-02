import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { Upload, X, Image, FileText, Video, Mic } from 'lucide-react';
import type { UploadedFile } from '@/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = [
  'image/',
  'video/',
  'audio/',
  'application/pdf',
  'text/plain',
];

export const UploadArea: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name} é muito grande. Limite ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`);
      return false;
    }

    const ok = ACCEPTED_TYPES.some(t => file.type.startsWith(t) || file.type === t);
    if (!ok) {
      toast.error(`${file.name} não é um tipo de arquivo suportado`);
      return false;
    }

    return true;
  };

  const handleFiles = (selected: FileList | null) => {
    if (!selected || selected.length === 0) return;

    const arr = Array.from(selected);
    const valid = arr.filter(validateFile);
    if (valid.length === 0) return;

    setFiles(prev => [...prev, ...valid]);

    valid.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = String(e.target?.result || '');
        setPreviews(prev => [...prev, { file, url }]);
      };

      // Read as data URL for small files (images, videos, audio, pdfs)
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePreview = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    if (files.length === 0) {
      toast.error('Nenhum arquivo selecionado');
      return;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const preview = previews.find(p => p.file === file)?.url;

        const uploaded: Omit<UploadedFile, 'id' | 'uploadDate'> = {
          filename: file.name,
          originalName: file.name,
          size: file.size,
          type: file.type,
          tags: [],
          category: 'uploads',
          description: '',
          previewUrl: preview,
          metadata: {},
        };

        storage.addUploadedFile(uploaded);
      }

      setFiles([]);
      setPreviews([]);
      if (inputRef.current) inputRef.current.value = '';
      toast.success('Arquivos enviados com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar arquivos');
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`p-6 rounded-lg border-dashed border-2 ${dragOver ? 'border-primary/80 bg-primary/5' : 'border-muted/30'} flex flex-col items-center justify-center text-center space-y-4`}
      >
        <Upload className={'h-8 w-8 text-muted-foreground'} />
        <p className={'text-sm text-muted-foreground'}>Arraste e solte arquivos aqui ou</p>
        <div className={'flex items-center space-x-2'}>
          <Input type="file" multiple ref={inputRef} onChange={(e) => handleFiles(e.target.files)} className={'hidden'} id={'upload-input'} />
          <label htmlFor={'upload-input'}>
            <Button variant={'outline'} onClick={() => inputRef.current?.click()}>
              Selecionar Arquivos
            </Button>
          </label>
          <Button variant={'ghost'} onClick={() => { setFiles([]); setPreviews([]); if (inputRef.current) inputRef.current.value = ''; }}>
            Limpar
          </Button>
        </div>
        <p className={'text-xs text-muted-foreground'}>Tipos suportados: imagens, vídeos, áudio, PDF, TXT — Máx: 5MB</p>
      </div>

      {previews.length > 0 && (
        <div className={'grid grid-cols-2 md:grid-cols-4 gap-3 mt-4'}>
          {previews.map((p, idx) => (
            <div key={idx} className={'border rounded-lg p-2 relative'}>
              <button className={'absolute top-2 right-2 p-1 bg-white rounded-full'} onClick={() => removePreview(idx)}>
                <X className={'h-3 w-3'} />
              </button>

              <div className={'h-32 flex items-center justify-center overflow-hidden'}>
                {p.file.type.startsWith('image/') ? (
                  <img src={p.url} alt={p.file.name} className={'object-contain h-full w-full'} />
                ) : p.file.type.startsWith('video/') ? (
                  <video src={p.url} className={'h-full w-full'} />
                ) : p.file.type.startsWith('audio/') ? (
                  <div className={'flex items-center space-x-2'}>
                    <Mic />
                    <div>{p.file.name}</div>
                  </div>
                ) : (
                  <div className={'flex items-center space-x-2'}>
                    <FileText />
                    <div>{p.file.name}</div>
                  </div>
                )}
              </div>

              <div className={'mt-2 text-xs text-muted-foreground'}>
                <div className={'font-medium'}>{p.file.name}</div>
                <div>{Math.round(p.file.size / 1024)} KB • {p.file.type || 'unknown'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={'flex justify-end mt-4'}>
        <Button onClick={uploadAll} className={'gradient-primary text-white border-0'}>
          Enviar ({files.length})
        </Button>
      </div>
    </div>
  );
};

export default UploadArea;
