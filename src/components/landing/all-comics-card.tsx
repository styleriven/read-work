export default function AllComicsCard({
  title,
  icon,
  Children,
  className,
  ...props
}: {
  title: string;
  icon: React.ReactNode;
  Children: any[];
  className?: string;
}) {
  return (
    <div className={`${className}`} {...props}>
      <div className="items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 text-xl font-semibold text-gray-800">
          <div className="text-gray-600">{icon}</div>
          <h2 className="">{title}</h2>
        </div>

        <div className="mt-2 mr-4">
          {Children.map((child, index) => (
            <button
              key={index}
              className={`flex ml-4 gap-2 text-base cursor-pointer ${
                child.status ? "text-gray-700" : "text-gray-400"
              }`}
              onClick={child.action}
            >
              <div className="text-gray-600">{child.icon}</div>
              <span className="flex items-center gap-1 ">{child.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
