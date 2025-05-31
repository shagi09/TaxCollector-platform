'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const ReceiptImagePage = () => {
  const { filename } = useParams();
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!filename) return;

    // Fetch the image as a blob with Authorization header
    fetch(`http://localhost:7000/api/receipt/${filename}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.blob())
      .then(blob => {
        setImgUrl(URL.createObjectURL(blob));
      });

    // Cleanup: revoke object URL when component unmounts or filename changes
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [filename]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Receipt Image</h1>
      {imgUrl && (
        <img
          src={imgUrl}
          alt="Receipt"
          className="w-full max-w-3xl rounded-xl shadow-lg"
        />
      )}
    </div>
  );
};

export default ReceiptImagePage;
