export default function Loader({ size }: { size: string }) {
  let sizeClass = '';

  switch (size) {
    case 'xs':
      sizeClass = 'h-4 w-4';
      break;
    case 'sm':
      sizeClass = 'h-6 w-6';
      break;
    case 'md':
      sizeClass = 'h-8 w-8';
      break;
    case 'lg':
      sizeClass = 'h-10 w-10';
      break;
    case 'xl':
      sizeClass = 'h-12 w-12';
      break;
    default:
      sizeClass = 'h-8 w-8';
  }

  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClass}`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}
