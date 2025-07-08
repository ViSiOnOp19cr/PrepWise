import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  // Calculate stats
  const totalInterviews = userInterviews?.length || 0;
  const completedInterviews =
    userInterviews?.filter((interview) => interview.feedback?.length > 0)
      .length || 0;
  const averageScore =
    userInterviews?.reduce((acc, interview) => {
      const feedback = interview.feedback?.[0];
      return acc + (feedback?.totalScore || 0);
    }, 0) / (completedInterviews || 1);

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1 className="welcome-title">
              Welcome back,{" "}
              <span className="text-primary-200">{user?.name || "User"}</span>!
              👋
            </h1>
            <p className="welcome-subtitle">
              Ready to ace your next interview? Let's practice and improve
              together.
            </p>
          </div>
          <div className="welcome-avatar">
            <Image
              src="/user-avatar.png"
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full border-2 border-primary-200"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-number">{totalInterviews}</h3>
              <p className="stat-label">Total Interviews</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-number">{completedInterviews}</h3>
              <p className="stat-label">Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3 className="stat-number">{Math.round(averageScore || 0)}</h3>
              <p className="stat-label">Average Score</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h3 className="stat-number">
                {hasUpcomingInterviews ? allInterview?.length : 0}
              </h3>
              <p className="stat-label">Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero CTA Section */}
      <section className="hero-cta-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2 className="hero-title">
              Get Interview-Ready with
              <span className="text-primary-200"> AI-Powered</span> Practice
            </h2>
            <p className="hero-subtitle">
              Practice real interview questions, get instant feedback, and boost
              your confidence with our advanced AI interviewer.
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <span>AI-Powered Questions</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Instant Feedback</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Track Progress</span>
              </div>
            </div>
            <Button asChild className="btn-primary-large">
              <Link href="/interview">
                <span>Start an Interview</span>
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
          <div className="hero-image">
            <Image
              src="/robot.png"
              alt="AI Interview Assistant"
              width={400}
              height={400}
              className="hero-robot"
            />
          </div>
        </div>
      </section>

      {/* Your Interviews Section */}
      <section className="interviews-section-container">
        <div className="section-header">
          <h2 className="section-title">Your Interviews</h2>
          <p className="section-subtitle">
            Track your progress and review past performances
          </p>
        </div>

        <div className="interviews-grid">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3 className="empty-title">No interviews yet</h3>
              <p className="empty-subtitle">
                You haven't taken any interviews yet. Start your first interview
                to begin your journey!
              </p>
              <Button asChild className="btn-primary mt-4">
                <Link href="/interview">Take Your First Interview</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Available Interviews Section */}
      <section className="interviews-section-container">
        <div className="section-header">
          <h2 className="section-title">Practice Interviews</h2>
          <p className="section-subtitle">
            Choose from our curated collection of interview questions
          </p>
        </div>

        <div className="interviews-grid">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3 className="empty-title">No interviews available</h3>
              <p className="empty-subtitle">
                There are no practice interviews available at the moment. Check
                back later!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
