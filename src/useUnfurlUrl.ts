import { useState, useEffect } from "react";

type RequestStatus = "iddle" | "loading" | "success" | "error";

type UrlData = {
  title: string;
  description: string | null;
  favicon: string | null;
  imageSrc: string | null;
};

function useUnfurlUrl(url: string) {
  const [status, setStatus] = useState<RequestStatus>("iddle");
  const [data, setData] = useState<null | UrlData>(null);
  console.log(url)
  useEffect(() => {
    setStatus("loading");
    fetch(`${process.env.REACT_APP_URL_SSL || 'https://dev.await.ai'}/unfurl`, {
      method: "POST",
      headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				url: url
			})
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setData(data);
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  }, [url]);

  return { status, data };
}

export default useUnfurlUrl;