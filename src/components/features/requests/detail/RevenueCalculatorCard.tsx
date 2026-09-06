"use client";

import { Calculator, MessageSquare, RefreshCw } from "lucide-react";

interface RevenueCalculatorCardProps {
    unit: string;
    pricePerUnit: number;
    customQty: number;
    onQtyChange: (qty: number) => void;
    showAction: boolean;
    isStartingChat: boolean;
    onStartChat: () => void;
}

const PRESETS = [5, 10, 25, 50];

export function RevenueCalculatorCard({
    unit,
    pricePerUnit,
    customQty,
    onQtyChange,
    showAction,
    isStartingChat,
    onStartChat,
}: RevenueCalculatorCardProps) {
    const estimatedEarnings = customQty * pricePerUnit;

    return (
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_2px_16px_-4px_rgba(23,23,23,0.06)]">
            <div className="flex items-center gap-2 border-b border-black/5 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#E8EEDD] text-[#6B7B4F]">
                    <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#171717]">
                    Hitung Potensi Hasil
                </h3>
            </div>

            <div className="mt-4 space-y-3">
                <div>
                    <label
                        htmlFor="custom-qty"
                        className="mb-1 block text-[11.5px] font-semibold text-[#3F3D38]"
                    >
                        Jumlah sampah Anda ({unit})
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            id="custom-qty"
                            type="number"
                            min={1}
                            value={customQty || ""}
                            onChange={(e) => {
                                const val = e.target.value === "" ? 0 : Number(e.target.value);
                                onQtyChange(isNaN(val) ? 0 : Math.max(0, val));
                            }}
                            className="w-full rounded-2xl border border-black/5 bg-[#F7F4EE] px-4 py-2.5 text-[13px] font-bold text-[#171717] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                        />
                        <span className="shrink-0 text-[12px] font-semibold text-[#78766B]">{unit}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => onQtyChange(preset)}
                            className={`flex-1 rounded-full border py-1.5 text-[11.5px] font-semibold transition-colors ${customQty === preset
                                ? "border-[#171717] bg-[#171717] text-white"
                                : "border-black/5 bg-white text-[#3F3D38] hover:border-black/15"
                                }`}
                        >
                            {preset} {unit}
                        </button>
                    ))}
                </div>

                <div className="rounded-2xl bg-[#F7F4EE] p-4 text-center">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#78766B]">
                        Estimasi Uang Didapat
                    </span>
                    <span className="mt-1 block text-2xl font-extrabold tracking-tight text-[#171717]">
                        Rp {estimatedEarnings.toLocaleString("id-ID")}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] text-[#8A8778]">
                        ({customQty} {unit} &times; Rp {pricePerUnit.toLocaleString("id-ID")})
                    </span>
                </div>
            </div>

            {showAction && (
                <button
                    type="button"
                    onClick={onStartChat}
                    disabled={isStartingChat}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#171717] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#2B2B26] disabled:opacity-60"
                >
                    {isStartingChat ? (
                        <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <>
                            <MessageSquare className="h-4 w-4" aria-hidden="true" />
                            <span>Setor &amp; Hubungi Pengepul</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}