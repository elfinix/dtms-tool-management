import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Download, Printer } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";

interface QRCodeGeneratorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transactionId: string;
    toolName?: string;
}

export function QRCodeGenerator({ open, onOpenChange, transactionId, toolName = "Tool" }: QRCodeGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (open && canvasRef.current && transactionId) {
            QRCode.toCanvas(
                canvasRef.current,
                transactionId,
                {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: "#1e40af",
                        light: "#ffffff",
                    },
                },
                (error) => {
                    if (error) {
                        console.error("QR Code generation error:", error);
                        toast.error("Failed to generate QR code");
                    }
                }
            );
        }
    }, [open, transactionId]);

    const handleDownload = () => {
        if (canvasRef.current) {
            const url = canvasRef.current.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = url;
            link.download = `QR-${transactionId}.png`;
            link.click();
            toast.success("QR Code downloaded successfully");
        }
    };

    const handlePrint = () => {
        window.print();
        toast.success("Print dialog opened");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>QR Code Generated</DialogTitle>
                    <DialogDescription>Show this QR code to students for borrowing {toolName}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-lg">
                        <canvas ref={canvasRef} className="border-4 border-white shadow-lg rounded-lg" />
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Transaction ID:</p>
                            <p className="font-mono text-blue-900">{transactionId}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={handleDownload} variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button onClick={handlePrint} variant="outline" className="flex-1">
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg text-sm">
                        <p className="text-blue-900 mb-2">Instructions:</p>
                        <ul className="text-muted-foreground text-xs space-y-1 list-disc list-inside">
                            <li>Students can scan this QR code to borrow the tool</li>
                            <li>The code contains the transaction ID for tracking</li>
                            <li>Download or print for physical display</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
