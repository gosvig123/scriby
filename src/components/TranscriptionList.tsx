import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


interface TranscriptionItem {
  name: string;
  date: string;
}

interface TranscriptionListProps {
  transcriptions: TranscriptionItem[];
}

function toSRTTime(timeInSeconds: number): string {
  const pad = (number: number, size: number = 2): string =>
    String(number).padStart(size, '0');
  const hours: number = Math.floor(timeInSeconds / 3600);
  const minutes: number = Math.floor(
    (timeInSeconds - hours * 3600) / 60
  );
  const seconds: number = Math.floor(
    timeInSeconds - hours * 3600 - minutes * 60
  );
  const milliseconds: number = Math.round((timeInSeconds % 1) * 1000);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(
    milliseconds,
    3
  )}`;
}

async function convertTextToPdf(text: string) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();

  const fontSize = 15;
  const helveticaFont = await pdfDoc.embedFont(
    StandardFonts.Helvetica
  );

  const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);

  page.drawText(text, {
    x: (width - textWidth) / 2,
    y: height - 80,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}

import { Document, Packer, Paragraph, TextRun } from 'docx';

async function convertTextToDocx(text: string) {
  // Create a new Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(text)],
          }),
        ],
      },
    ],
  });

  // Generate the document in .docx format as a blob
  const blob = await Packer.toBlob(doc);

  return blob;
}

const TranscriptionsList = ({
  transcriptions,
}: TranscriptionListProps) => {
  const [selectedFormat, setSelectedFormat] = useState('txt');

  async function downloadTranscription(fileName: string) {
    const baseFileName = fileName.split('.')[0];
    const extension =
      selectedFormat === 'pdf'
        ? 'pdf'
        : selectedFormat === 'docx'
        ? 'docx'
        : 'txt';
    const fileNameToPass = `${baseFileName}.${extension}`;
    let blob;
    try {
      const response = await fetch(
        `/api/downloadtranscription?fileName=${baseFileName}.txt`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonResponse: any = await response.json();

      console.log(jsonResponse);
      interface Word {
        word: string;
        start_time: number;
        end_time: number;
      }

      let onlyText = jsonResponse.text
        .map((item: Word) => item.word)
        .join(' ');

      console.log(onlyText);

      if (selectedFormat === 'txt') {
        blob = new Blob([onlyText], { type: 'text/plain' });
      } else if (selectedFormat === 'pdf') {
        const pdfBytes = await convertTextToPdf(onlyText);
        blob = new Blob([pdfBytes.buffer], {
          type: 'application/pdf',
        });
      }
      if (selectedFormat === 'docx') {
        blob = await convertTextToDocx(onlyText);
      } else if (selectedFormat === 'srt') {
        let srtContent = '';
        let index = 1;

        jsonResponse.text.forEach((item: Word, idx: number) => {
          try {
            // Log for debugging
            console.log('Processing item: ', item);

            // Validate that start_Time and end_Time are numbers
            if (
              typeof item.start_time !== 'number' ||
              typeof item.end_time !== 'number'
            ) {
              console.warn('Invalid time data:', item);
              return;
            }

            const startTime: string = toSRTTime(item.start_time);
            const endTime: string = toSRTTime(item.end_time);

            // Log for debugging
            console.log('Converted times: ', startTime, endTime);

            srtContent += `${index}\n`;
            srtContent += `${startTime} --> ${endTime}\n`;
            srtContent += `${item.word}\n\n`;
            index++;
          } catch (error) {
            console.warn('Error processing time data:', error);
          }
        });

        // Log the SRT content
        console.log('Generated SRT content: ', srtContent);

        // Create the blob only if there is content
        if (srtContent) {
          blob = new Blob([srtContent], { type: 'text/plain' });
        } else {
          console.warn('SRT content is empty');
        }
      }

      if (!blob) {
        console.error('Invalid format');
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileNameToPass;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  return (
    <div
      className='w-full max-w-7xl mx-auto mt-8 bg-white shadow-md rounded-lg overflow-y-auto'
      style={{ maxHeight: '70vh' }}
    >
      <div className='bg-gray-200 p-4 rounded-t-lg'>
        <h2 className='text-2xl font-bold'>Transcriptions</h2>
      </div>
      <div className='p-4'>
        <ul className='divide-y divide-gray-200'>
          <li className='p-3 grid grid-cols-[1fr,3fr,2fr,1fr,1fr] gap-4 bg-gray-200 text-gray-700 font-semibold'>
            <span className='text-lg md:text-xl'>Upload Date</span>
            <span className='text-lg md:text-xl'>File Name</span>
            <span className='text-lg md:text-xl'>Format</span>
            <span className='text-lg md:text-xl mx-auto'>Action</span>
          </li>
          {transcriptions.map((item, index) => (
            <li
              key={index}
              className='p-3 grid grid-cols-[1fr,3fr,2fr,1fr,1fr] gap-4 items-center'
            >
              <span className='text-gray-500 text-lg md:text-xl truncate w-full'>
                {item.date}
              </span>
              <span className='text-gray-700 text-lg md:text-xl truncate w-full'>
                {item.name}
              </span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className='border rounded-md p-2 text-gray-700'
              >
                <option value='txt'>TXT</option>
                <option value='pdf'>PDF</option>
                <option value='docx'>DOCX</option>
                <option value='srt'>SRT</option>
              </select>
              <button
                className='solidPurpleButton'
                onClick={() => downloadTranscription(item.name)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TranscriptionsList;
