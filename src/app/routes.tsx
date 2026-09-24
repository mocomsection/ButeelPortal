import { Navigate } from "react-router";

import LoginScreen from "@/pages/auth/LoginScreen";
import RegisterScreen from "@/pages/auth/RegisterScreen";
import VerifyScreen from "@/pages/auth/VerifyScreen";
import TermsScreen from "@/pages/auth/TermsScreen";

import OnboardingAccountTypeScreen from "@/pages/onboarding/OnboardingAccountTypeScreen";
import OnboardingLabelScreen from "@/pages/onboarding/OnboardingLabelScreen";
import OnboardingAgreementsScreen from "@/pages/onboarding/OnboardingAgreementsScreen";
import OnboardingCompleteScreen from "@/pages/onboarding/OnboardingCompleteScreen";

import DashboardScreen from "@/pages/DashboardScreen";
import AccountStatusScreen from "@/pages/AccountStatusScreen";
import AccountTaxScreen from "@/pages/AccountTaxScreen";
import DistributionAgreementScreen from "@/pages/DistributionAgreementScreen";
import PaymentInfoScreen from "@/pages/PaymentInfoScreen";
import CatalogScreen from "@/pages/CatalogScreen";
import ReleaseDetailScreen from "@/pages/ReleaseDetailScreen";
import RevenueScreen from "@/pages/RevenueScreen";
import ReportsScreen from "@/pages/ReportsScreen";
import ProfileScreen from "@/pages/ProfileScreen";
import StatementDetailScreen from "@/pages/StatementDetailScreen";
import HelpScreen from "@/pages/HelpScreen";
import ScreenMapScreen from "@/pages/ScreenMapScreen";
import UsersScreen from "@/pages/UsersScreen";
import NotFoundScreen from "@/pages/NotFoundScreen";

import MusicWizard from "@/pages/submit/MusicWizard";
import SubmitStep1 from "@/pages/submit/SubmitStep1";
import SubmitStep2 from "@/pages/submit/SubmitStep2";
import SubmitTracksScreen from "@/pages/submit/SubmitTracksScreen";
import SubmitCoverArtScreen from "@/pages/submit/SubmitCoverArtScreen";
import SubmitSettingsScreen from "@/pages/submit/SubmitSettingsScreen";
import SubmitReviewScreen from "@/pages/submit/SubmitReviewScreen";
import SubmitSuccessScreen from "@/pages/submit/SubmitSuccessScreen";
import SubmitAudioBookInfoScreen from "@/pages/submit/SubmitAudioBookInfoScreen";
import SubmitFilmInfoScreen from "@/pages/submit/SubmitFilmInfoScreen";

export const routes = [
  { path: "/",                        element: <Navigate to="/login" replace /> },
  { path: "/login",                   element: <LoginScreen /> },
  { path: "/register",                element: <RegisterScreen /> },
  { path: "/verify",                  element: <VerifyScreen /> },
  { path: "/terms",                   element: <TermsScreen /> },
  { path: "/onboarding/account-type", element: <OnboardingAccountTypeScreen /> },
  { path: "/onboarding/label",        element: <OnboardingLabelScreen /> },
  { path: "/onboarding/agreements",   element: <OnboardingAgreementsScreen /> },
  { path: "/onboarding/complete",     element: <OnboardingCompleteScreen /> },
  { path: "/dashboard",               element: <DashboardScreen /> },
  { path: "/reports",                  element: <ReportsScreen /> },
  { path: "/revenue",                 element: <RevenueScreen /> },
  { path: "/revenue/statement",       element: <StatementDetailScreen /> },
  { path: "/catalog",                 element: <Navigate to="/catalog/music" replace /> },
  { path: "/catalog/music",           element: <CatalogScreen /> },
  { path: "/catalog/audiobook",       element: <CatalogScreen /> },
  { path: "/catalog/film",            element: <CatalogScreen /> },
  { path: "/catalog/music/release",    element: <ReleaseDetailScreen /> },
  { path: "/catalog/audiobook/book",   element: <ReleaseDetailScreen /> },
  { path: "/catalog/film/film",        element: <ReleaseDetailScreen /> },
  { path: "/submit",                  element: <SubmitStep1 /> },
  { path: "/submit/release",           element: <MusicWizard /> },
  { path: "/submit/release-info",     element: <SubmitStep2 /> },
  { path: "/submit/tracks",           element: <SubmitTracksScreen /> },
  { path: "/submit/cover-art",        element: <SubmitCoverArtScreen /> },
  { path: "/submit/settings",         element: <SubmitSettingsScreen /> },
  { path: "/submit/review",           element: <SubmitReviewScreen /> },
  { path: "/submit/success",          element: <SubmitSuccessScreen /> },
  { path: "/submit/audiobook",         element: <SubmitAudioBookInfoScreen /> },
  { path: "/submit/film",             element: <SubmitFilmInfoScreen /> },
  { path: "/profile",                  element: <ProfileScreen /> },
  { path: "/account",                 element: <AccountStatusScreen /> },
  { path: "/account/tax",             element: <AccountTaxScreen /> },
  { path: "/account/agreement",       element: <DistributionAgreementScreen /> },
  { path: "/account/payment",         element: <PaymentInfoScreen /> },
  { path: "/users",                   element: <UsersScreen /> },
  { path: "/help",                    element: <HelpScreen /> },
  { path: "/screen-map",              element: <ScreenMapScreen /> },
  { path: "*",                        element: <NotFoundScreen /> },
];
