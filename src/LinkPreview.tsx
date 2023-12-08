import useUnfurlUrl from './useUnfurlUrl';
function UnfurledUrlPreview({
  url,
  urlData,
}: {
  url: string;
  urlData: any;
}) {
  return (
    <a style={{textDecoration: 'none'}} href={url} target='_blank'>
      <div className='link'>
        {urlData.favicon && (
          <img
            style={{ paddingRight: 1}}
            width={30}
            src={urlData.favicon}
          />
        )}
        <div className="">{urlData.title}</div>

      </div>
    </a>
  );
}
function LoadingSkeleton() {
  return (
    <div className='link'>
      Loading
    </div>
  );
}
function ErrorFallback({ url }: any) {
  return (
    <a style={{textDecoration: 'none'}} href={url} target='_blank'>
      <div className='link'>
        <div className="line-clamp-1">{url.replace('http://', '').replace('https://', '')}</div>
      </div>
    </a>
  );
}
export default function LinkPreview({ url }: { url: string }): any {
  const { data, status } = useUnfurlUrl(url);
  if (status === "error") {
    return <ErrorFallback url={url} />;
  }
  if (status === "success") {
    return <UnfurledUrlPreview url={url} urlData={data} />;
  }
  return <LoadingSkeleton />;
}
