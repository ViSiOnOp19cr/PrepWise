import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-gradient-to-r from-blue-500 to-blue-600",
      Mixed: "bg-gradient-to-r from-purple-500 to-purple-600",
      Technical: "bg-gradient-to-r from-green-500 to-green-600",
    }[normalizedType] || "bg-gradient-to-r from-gray-500 to-gray-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const isCompleted = !!feedback;
  const score = feedback?.totalScore || 0;

  return (
    <div className="interview-card-container">
      <div className="interview-card">
        {/* Type Badge */}
        <div className={cn("interview-badge", badgeColor)}>
          <span className="badge-text">{normalizedType}</span>
        </div>

        {/* Status Indicator */}
        <div className="status-indicator">
          {isCompleted ? (
            <div className="status-completed">
              <span className="status-icon">✓</span>
              <span className="status-text">Completed</span>
            </div>
          ) : (
            <div className="status-pending">
              <span className="status-icon">⏳</span>
              <span className="status-text">Pending</span>
            </div>
          )}
        </div>

        {/* Cover Image */}
        <div className="cover-image-container">
          <Image
            src={getRandomInterviewCover()}
            alt="Interview Cover"
            width={90}
            height={90}
            className="cover-image"
          />
        </div>

        {/* Interview Info */}
        <div className="interview-info">
          <h3 className="interview-title">{role} Interview</h3>

          <div className="interview-meta">
            <div className="meta-item">
              <Image
                src="/calendar.svg"
                width={18}
                height={18}
                alt="Calendar"
              />
              <span>{formattedDate}</span>
            </div>

            <div className="meta-item">
              <Image src="/star.svg" width={18} height={18} alt="Score" />
              <span
                className={cn(
                  "score",
                  score >= 70
                    ? "text-green-400"
                    : score >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                )}
              >
                {score || "---"}/100
              </span>
            </div>
          </div>

          <p className="interview-description">
            {feedback?.finalAssessment ||
              "Ready to tackle this interview challenge? Let's get started and see how you perform!"}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="card-bottom">
          <div className="tech-stack">
            <DisplayTechIcons techStack={techstack} />
          </div>

          <Button
            className={cn(
              "card-button",
              isCompleted ? "btn-secondary" : "btn-primary"
            )}
          >
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "View Feedback" : "Start Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
