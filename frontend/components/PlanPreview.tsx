"use client";

type PlanPreviewProps = {
    uploadedImage: string | null;
    uploadedImageName: string;
};

export default function PlanPreview({
    uploadedImage,
    uploadedImageName,
}: PlanPreviewProps) {
    return (
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Reference Preview
                </p>
                <p className="mt-1 text-[12px] text-slate-500">
                    Exterior inspiration image
                </p>
            </div>

            <div className="bg-slate-50 p-3">
                <div className="flex h-[148px] items-center justify-center overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100">
                    {uploadedImage ? (
                        <img
                            src={uploadedImage}
                            alt={uploadedImageName || "Reference image"}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400 shadow-sm">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    Upload a reference image
                                </p>
                                <p className="mt-1 text-[11px] text-slate-400">
                                    The preview will appear here
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {uploadedImage ? (
                <div className="border-t border-slate-100 px-4 py-3">
                    <p className="truncate text-[12px] font-medium text-slate-700">
                        {uploadedImageName}
                    </p>
                </div>
            ) : null}
        </div>
    );
}
