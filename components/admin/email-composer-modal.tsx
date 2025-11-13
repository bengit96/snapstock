"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  X,
  Send,
  Sparkles,
  Plus,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  active: boolean;
  maxUses: number | null;
  usedCount: number;
  validUntil: string | null;
}

interface EmailComposerModalProps {
  selectedUserIds: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export function EmailComposerModal({
  selectedUserIds,
  onClose,
  onSuccess,
}: EmailComposerModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>("");
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [showNewPromoForm, setShowNewPromoForm] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingPromoCodes, setLoadingPromoCodes] = useState(true);
  const { toast } = useToast();

  // Load promo codes
  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      setLoadingPromoCodes(true);
      const response = await fetch("/api/admin/promo-codes");
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data.data.codes || []);
      }
    } catch (error) {
      console.error("Failed to fetch promo codes:", error);
    } finally {
      setLoadingPromoCodes(false);
    }
  };

  const handleCreatePromoCode = async () => {
    if (!newPromoCode || !newPromoDiscount) {
      toast({
        title: "Error",
        description: "Please enter both code and discount percentage",
        variant: "destructive",
      });
      return;
    }

    const discount = parseInt(newPromoDiscount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast({
        title: "Error",
        description: "Discount must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newPromoCode,
          discountPercent: discount,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Promo code created successfully",
        });
        setNewPromoCode("");
        setNewPromoDiscount("");
        setShowNewPromoForm(false);
        fetchPromoCodes();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to create promo code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create promo code",
        variant: "destructive",
      });
    }
  };

  const handleSendEmails = async () => {
    if (!subject || !message) {
      toast({
        title: "Error",
        description: "Please enter both subject and message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/admin/send-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: selectedUserIds,
          subject,
          message,
          promoCode: selectedPromoCode || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: data.data.message,
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send emails",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send emails",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const activePromoCodes = promoCodes.filter((code) => code.active);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Compose Email Campaign
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Sending to {selectedUserIds.length} user
              {selectedUserIds.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Subject */}
          <div>
            <Label htmlFor="subject">Email Subject *</Label>
            <Input
              id="subject"
              type="text"
              placeholder="e.g., Special offer just for you!"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Write your message here... Use line breaks for paragraphs."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 min-h-[200px]"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Keep it personal and concise. The message will be formatted
              nicely in the email.
            </p>
          </div>

          {/* Promo Code Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Promo Code (Optional)</Label>
              <Button
                onClick={() => setShowNewPromoForm(!showNewPromoForm)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Code
              </Button>
            </div>

            {showNewPromoForm && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="newCode" className="text-xs">
                      Code
                    </Label>
                    <Input
                      id="newCode"
                      type="text"
                      placeholder="SAVE25"
                      value={newPromoCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPromoCode(e.target.value.toUpperCase())
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newDiscount" className="text-xs">
                      Discount %
                    </Label>
                    <Input
                      id="newDiscount"
                      type="number"
                      placeholder="25"
                      min="0"
                      max="100"
                      value={newPromoDiscount}
                      onChange={(e) => setNewPromoDiscount(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreatePromoCode}
                  size="sm"
                  className="w-full"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Create Promo Code
                </Button>
              </div>
            )}

            {loadingPromoCodes ? (
              <div className="flex items-center justify-center p-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                <button
                  onClick={() => setSelectedPromoCode("")}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedPromoCode === ""
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    No promo code
                  </span>
                </button>

                {activePromoCodes.map((code) => (
                  <button
                    key={code.id}
                    onClick={() => setSelectedPromoCode(code.code)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPromoCode === code.code
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-mono font-bold text-purple-600">
                          {code.code}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          - {code.discountType === 'percentage' ? `${code.discountValue}% off` : `$${code.discountValue} off`}
                        </span>
                      </div>
                      {selectedPromoCode === code.code && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    {code.maxUses && (
                      <p className="text-xs text-gray-500 mt-1">
                        Used {code.usedCount}/{code.maxUses} times
                      </p>
                    )}
                  </button>
                ))}

                {activePromoCodes.length === 0 && (
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No active promo codes. Create one above!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          {selectedPromoCode && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Promo code will be included
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    Recipients will see a beautifully formatted promo code box
                    in their email with a call-to-action button.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800">
          <Button onClick={onClose} variant="outline" disabled={sending}>
            Cancel
          </Button>
          <Button
            onClick={handleSendEmails}
            disabled={sending || !subject || !message}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {sending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to {selectedUserIds.length} User
                {selectedUserIds.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
