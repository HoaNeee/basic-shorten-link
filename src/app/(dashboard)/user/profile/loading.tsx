import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="max-w-2xl p-6 mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2 text-center">
        <Skeleton className="h-9 w-64 mx-auto" />
        <Skeleton className="w-48 h-5 mx-auto" />
      </div>

      {/* Avatar Section Skeleton */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Skeleton className="size-20 rounded-full" />
        </div>
        <div className="space-y-2 text-center">
          <Skeleton className="w-32 h-6 mx-auto" />
          <Skeleton className="w-24 h-5 mx-auto" />
          <Skeleton className="w-16 h-6 mx-auto rounded-full" />
        </div>
      </div>

      {/* Profile Form Skeleton */}
      <div className="p-6 space-y-6 bg-white border rounded-lg">
        <div className="flex items-center justify-between">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="h-9 w-24" />
        </div>

        <div className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-full h-10" />
          </div>

          {/* Full Name Field */}
          <div className="space-y-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-full h-10" />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-full h-10" />
          </div>

          {/* Additional Information Section */}
          <div className="pt-4 space-y-4 border-t">
            <Skeleton className="w-36 h-5" />

            <div className="md:grid-cols-2 grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-full h-10" />
              </div>

              <div className="space-y-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-full h-10" />
              </div>

              <div className="space-y-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-full h-10" />
              </div>

              <div className="space-y-2">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-full h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section Skeleton */}
      <div className="p-6 space-y-6 bg-white border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-44 h-4" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
