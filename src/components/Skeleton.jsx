const SkeletonEl = () => (
  <div className="flex flex-col w-80 rounded-2xl">
    <div className="relative w-full h-64">
      <div className="rounded-lg bg-gray-900/60 h-64 w-full"></div>
    </div>
    <div className="mt-3 justify-between flex flex-col w-full">
      <div className="relative">
        <div className="my-5 w-full">
          <div className="h-5 bg-gray-900/60 rounded-2xl w-2/3"></div>
        </div>
        <div className="my-5 flex justify-between w-full">
          <div className="h-3 bg-gray-900/60 rounded-2xl w-1/4"></div>
          <div className="h-3 bg-gray-900/60 rounded-2xl w-2/3"></div>
        </div>
        <div className="hidden lg:block">
          <div className="h-7 bg-gray-900/60 rounded-2xl"></div>
        </div>
      </div>
    </div>
  </div>
);

export const Skeleton = () => (
  <div className="flex flex-wrap justify-between sm:m-0 m-10">
    <SkeletonEl />
    <SkeletonEl />
    <SkeletonEl />
  </div>
);
