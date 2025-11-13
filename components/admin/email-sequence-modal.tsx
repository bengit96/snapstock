"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  X,
  Send,
  Calendar,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

interface EmailSequenceStep {
  id: string;
  delayDays: number;
  subject: string;
  message: string;
  promoCode?: string;
  discountPercent?: number;
}

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  steps: EmailSequenceStep[];
  targetSegment: string;
}

interface EmailSequenceModalProps {
  selectedUserIds: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export function EmailSequenceModal({
  selectedUserIds,
  onClose,
  onSuccess,
}: EmailSequenceModalProps) {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSequences();
  }, []);

  const fetchSequences = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/email-sequences");
      if (response.ok) {
        const data = await response.json();
        setSequences(data.data.sequences || []);
        // Auto-select first sequence
        if (data.data.sequences.length > 0) {
          setSelectedSequence(data.data.sequences[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch sequences:", error);
      toast({
        title: "Error",
        description: "Failed to load email sequences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const handleScheduleSequence = async () => {
    if (!selectedSequence) {
      toast({
        title: "Error",
        description: "Please select a sequence",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/admin/email-sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequenceId: selectedSequence.id,
          userIds: selectedUserIds,
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
          description: data.error || "Failed to schedule sequence",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule sequence",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const formatMessage = (message: string) => {
    return message
      .split('\n')
      .map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Schedule Email Sequence
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

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Sequence Selection */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Sequence
              </h3>
              <div className="space-y-3">
                {sequences.map((sequence) => (
                  <button
                    key={sequence.id}
                    onClick={() => setSelectedSequence(sequence)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedSequence?.id === sequence.id
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {sequence.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {sequence.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {sequence.steps.length} emails
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {sequence.steps[sequence.steps.length - 1].delayDays} days
                          </span>
                        </div>
                      </div>
                      {selectedSequence?.id === sequence.id && (
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sequence Preview */}
            {selectedSequence && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Email Timeline Preview
                </h3>
                
                <div className="space-y-4">
                  {selectedSequence.steps.map((step, index) => {
                    const isExpanded = expandedSteps.has(step.id);
                    return (
                      <div
                        key={step.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleStep(step.id)}
                          className="w-full p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <span className="text-sm font-bold text-purple-600">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  {step.delayDays === 0
                                    ? "Immediately"
                                    : `Day ${step.delayDays}`}
                                </span>
                                {step.promoCode && (
                                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                                    {step.promoCode} ({step.discountPercent}% off)
                                  </span>
                                )}
                              </div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {step.subject}
                              </h4>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {formatMessage(step.message)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* What Happens Info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        What will happen:
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>
                          • {selectedSequence.steps.length} emails will be scheduled for each user
                        </li>
                        <li>
                          • Emails within 7 days will be scheduled immediately
                        </li>
                        <li>
                          • Emails beyond 7 days will be scheduled automatically when they're within the 7-day window
                        </li>
                        <li>
                          • If a user subscribes, remaining emails will be cancelled
                        </li>
                        <li>
                          • You can view and manage scheduled emails in the admin panel
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
          <Button onClick={onClose} variant="outline" disabled={sending}>
            Cancel
          </Button>
          <Button
            onClick={handleScheduleSequence}
            disabled={sending || !selectedSequence}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {sending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Scheduling...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Schedule for {selectedUserIds.length} User
                {selectedUserIds.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

