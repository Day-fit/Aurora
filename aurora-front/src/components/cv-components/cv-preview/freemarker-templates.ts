/**
 * Freemarker-compatible HTML template generators for resume preview.
 * These functions generate the same HTML output as the backend Freemarker templates.
 */

import { LanguageType } from "@/lib/types/language";
import {
  getTemplateMessages,
  getDateLocale,
  TemplateMessages,
} from "@/lib/i18n/messages";

interface TemplateData {
  name?: string;
  surname?: string;
  title?: string;
  profileDescription?: string;
  email?: string;
  website?: string;
  linkedIn?: string;
  gitHub?: string;
  education?: Array<{
    institution?: string;
    major?: string;
    degree?: string;
    fromYear?: number;
    toYear?: number;
  }>;
  skills?: Array<{
    name?: string;
    level?: string;
  }>;
  workExperience?: Array<{
    company?: string;
    position?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }>;
  achievements?: Array<{
    title?: string;
    description?: string;
    year?: number;
  }>;
  personalPortfolio?: Array<{
    name?: string;
    description?: string;
  }>;
  profileImage?: string;
  language?: LanguageType;
}

/**
 * Format date for display. In frontend, dates come as ISO strings or are already formatted.
 */
function formatDate(dateStr?: string, language?: LanguageType): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const locale = getDateLocale(language);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generate HTML for Template 1 - Two-column teal sidebar design
 */
export function generateTemplate1Html(data: TemplateData): string {
  const {
    name = "",
    surname = "",
    title = "",
    profileDescription,
    email,
    website,
    linkedIn,
    gitHub,
    education = [],
    skills = [],
    workExperience = [],
    achievements = [],
    personalPortfolio = [],
    profileImage,
    language,
  } = data;

  const i18n: TemplateMessages = getTemplateMessages(language);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${name} ${surname}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        .container {
            width: 100%;
            height: 100%;
            display: flex;
            box-sizing: border-box;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background: #fff;
            color: #333;
            height: 100%;
        }

        .left {
            width: 35%;
            background: #1c7c74;
            color: #fff;
            padding: 25px;
            box-sizing: border-box;
        }

        .right {
            width: 65%;
            padding: 25px;
            box-sizing: border-box;
            overflow-y: auto;
        }

        .profile-pic {
            width: 100%;
            max-width: 180px;
            border-radius: 6px;
            margin-bottom: 25px;
            border: 3px solid #fff;
            display: block;
            aspect-ratio: 1;
            object-fit: cover;
        }

        .section-title {
            font-size: 12px;
            font-weight: bold;
            border-bottom: 2px solid #fff;
            padding-bottom: 5px;
            margin-top: 20px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .contact-item, .social-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 10px;
            word-wrap: break-word;
        }

        .contact-item span, .social-item span {
            margin-left: 6px;
            color: #fff;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        h1 {
            font-size: 28px;
            letter-spacing: 1px;
            margin: 0;
        }

        h2 {
            font-size: 16px;
            letter-spacing: 1px;
            margin: 5px 0 20px 0;
            font-weight: 400;
            color: #1c7c74;
        }

        p {
            font-size: 11px;
            line-height: 1.6;
            margin: 5px 0;
            text-align: justify;
        }

        ul {
            padding-left: 15px;
            margin: 5px 0;
        }

        li {
            margin-bottom: 5px;
            font-size: 10px;
            line-height: 1.4;
        }

        .bold {
            font-weight: bold;
        }

        .skill-level {
            font-size: 9px;
            color: #e0f7f7;
            margin-left: 5px;
        }

        .mt-small {
            margin-top: 12px;
        }

        .mt-tiny {
            margin-top: 4px;
        }

        a {
            color: #fff;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .right .section-title {
            color: #1c7c74;
            border-color: #1c7c74;
        }

        .experience-item, .portfolio-item, .education-item {
            margin-bottom: 15px;
        }

        .date-range {
            font-size: 10px;
            color: #666;
            font-style: italic;
        }

        .left .date-range {
            color: #e0f7f7;
        }

        .description {
            font-size: 10px;
            color: #555;
            line-height: 1.5;
            margin-top: 5px;
        }
    </style>
</head>
<body>
<div class="container">

    <div class="left">
        ${profileImage ? `<img src="${profileImage}" alt="Profile Picture" class="profile-pic">` : ""}

        ${
          email || website || linkedIn || gitHub
            ? `
            <div class="section-title">${i18n.contact}</div>
            ${email ? `<div class="contact-item">📧<span>${email}</span></div>` : ""}
            ${website ? `<div class="contact-item">🌐<span><a href="${website}" target="_blank">${i18n.portfolio}</a></span></div>` : ""}
            ${linkedIn ? `<div class="social-item">🔗<span><a href="${linkedIn}" target="_blank">${i18n.linkedin}</a></span></div>` : ""}
            ${gitHub ? `<div class="social-item">🐱<span><a href="${gitHub}" target="_blank">${i18n.github}</a></span></div>` : ""}
        `
            : ""
        }

        ${
          education.length > 0
            ? `
            <div class="section-title">${i18n.education}</div>
            ${education
              .map(
                (edu) => `
                <div class="education-item">
                    <div class="mt-small bold">${edu.institution || ""}</div>
                    <div class="mt-tiny">${edu.degree || ""}${edu.major ? ` in ${edu.major}` : ""}</div>
                    <div class="date-range">${edu.fromYear || ""} - ${edu.toYear || i18n.present}</div>
                </div>
            `,
              )
              .join("")}
        `
            : ""
        }

        ${
          skills.length > 0
            ? `
            <div class="section-title">${i18n.skills}</div>
            <ul>
                ${skills
                  .map(
                    (skill) => `
                    <li>${skill.name || ""}${skill.level ? `<span class="skill-level">(${skill.level})</span>` : ""}</li>
                `,
                  )
                  .join("")}
            </ul>
        `
            : ""
        }
    </div>

    <div class="right">
        <h1>${name} ${surname}</h1>
        <h2>${title}</h2>

        ${
          profileDescription
            ? `
            <div class="section-title">${i18n.profile}</div>
            <p>${profileDescription}</p>
        `
            : ""
        }

        ${
          workExperience.length > 0
            ? `
            <div class="section-title">${i18n.workExperience}</div>
            ${workExperience
              .map(
                (exp) => `
                <div class="experience-item">
                    <div class="bold">${exp.position || ""}</div>
                    <div class="mt-tiny">${exp.company || ""}</div>
                    <div class="date-range">
                        ${formatDate(exp.startDate, language)} - ${exp.endDate ? formatDate(exp.endDate, language) : i18n.present}
                    </div>
                    ${exp.description ? `<p class="description">${exp.description}</p>` : ""}
                </div>
            `,
              )
              .join("")}
        `
            : ""
        }

        ${
          personalPortfolio.length > 0
            ? `
            <div class="section-title">${i18n.projects}</div>
            ${personalPortfolio
              .map(
                (portfolio) => `
                <div class="portfolio-item">
                    <div class="bold">${portfolio.name || ""}</div>
                    <p class="description">${portfolio.description || ""}</p>
                </div>
            `,
              )
              .join("")}
        `
            : ""
        }

        ${
          achievements.length > 0
            ? `
            <div class="section-title">${i18n.achievements}</div>
            <ul>
                ${achievements
                  .map(
                    (ach) => `
                    <li class="mt-small">
                        <span class="bold">${ach.title || ""}</span>
                        ${ach.year ? ` (${ach.year})` : ""} - ${ach.description || ""}
                    </li>
                `,
                  )
                  .join("")}
            </ul>
        `
            : ""
        }
    </div>
</div>
</body>
</html>`;
}

/**
 * Generate HTML for Template 2 - Modern gradient header design
 */
export function generateTemplate2Html(data: TemplateData): string {
  const {
    name = "",
    surname = "",
    title = "",
    profileDescription,
    email,
    website,
    linkedIn,
    gitHub,
    education = [],
    skills = [],
    workExperience = [],
    achievements = [],
    personalPortfolio = [],
    profileImage,
    language,
  } = data;

  const i18n: TemplateMessages = getTemplateMessages(language);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${name} ${surname}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        .container {
            width: 100%;
            min-height: 100%;
            box-sizing: border-box;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica', 'Arial', sans-serif;
            background: #fff;
            color: #2c3e50;
            height: 100%;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 40px 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 32px;
            margin: 0 0 8px 0;
            font-weight: 700;
            letter-spacing: 2px;
        }

        .header h2 {
            font-size: 18px;
            margin: 0;
            font-weight: 300;
            opacity: 0.95;
        }

        .profile-pic {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 5px solid #fff;
            margin: 0 auto 15px;
            display: block;
            object-fit: cover;
        }

        .contact-bar {
            background: #f8f9fa;
            padding: 15px 30px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            border-bottom: 2px solid #667eea;
        }

        .contact-item {
            font-size: 10px;
            color: #555;
            margin: 0 10px 10px 10px;
        }

        .contact-item a {
            color: #555;
            text-decoration: none;
        }

        .contact-item a:hover {
            text-decoration: underline;
        }

        .content {
            padding: 30px;
        }

        .two-column {
            display: flex;
        }

        .main-column {
            margin-right: 30px;
            flex: 2;
        }

        .side-column {
            flex: 1;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }

        .section {
            margin-bottom: 25px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 3px solid #667eea;
        }

        .side-column .section-title {
            font-size: 12px;
            color: #764ba2;
            border-bottom: 2px solid #764ba2;
        }

        .experience-item, .portfolio-item, .education-item, .achievement-item {
            margin-bottom: 18px;
        }

        .item-title {
            font-size: 12px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 3px;
        }

        .item-subtitle {
            font-size: 11px;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 3px;
        }

        .date-range {
            font-size: 9px;
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 5px;
        }

        .description {
            font-size: 10px;
            color: #555;
            line-height: 1.6;
            text-align: justify;
        }

        .profile-text {
            font-size: 11px;
            line-height: 1.7;
            color: #555;
            text-align: justify;
        }

        .skill-item {
            background: #fff;
            padding: 8px 12px;
            margin-bottom: 8px;
            border-radius: 4px;
            font-size: 10px;
            border-left: 3px solid #764ba2;
        }

        .skill-level {
            font-size: 9px;
            color: #7f8c8d;
            font-weight: 600;
            margin-left: 8px;
        }

        .education-degree {
            font-size: 10px;
            color: #2c3e50;
            font-weight: 600;
        }

        ul {
            margin: 0;
            padding-left: 18px;
        }

        li {
            font-size: 10px;
            line-height: 1.5;
            margin-bottom: 6px;
            color: #555;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        ${profileImage ? `<img src="${profileImage}" alt="Profile Picture" class="profile-pic">` : ""}
        <h1>${name} ${surname}</h1>
        <h2>${title}</h2>
    </div>

    <div class="contact-bar">
        ${email ? `<div class="contact-item">📧 ${email}</div>` : ""}
        ${website ? `<div class="contact-item">🌐 <a href="${website}" target="_blank">${website}</a></div>` : ""}
        ${linkedIn ? `<div class="contact-item">🔗 <a href="${linkedIn}" target="_blank">${i18n.linkedin}</a></div>` : ""}
        ${gitHub ? `<div class="contact-item">🐱 <a href="${gitHub}" target="_blank">${i18n.github}</a></div>` : ""}
    </div>

    <div class="content">
        <div class="two-column">
            <div class="main-column">
                ${
                  profileDescription
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.professionalSummary}</div>
                        <p class="profile-text">${profileDescription}</p>
                    </div>
                `
                    : ""
                }

                ${
                  workExperience.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.workExperience}</div>
                        ${workExperience
                          .map(
                            (exp) => `
                            <div class="experience-item">
                                <div class="item-title">${exp.position || ""}</div>
                                <div class="item-subtitle">${exp.company || ""}</div>
                                <div class="date-range">
                                    ${formatDate(exp.startDate, language)} - ${exp.endDate ? formatDate(exp.endDate, language) : i18n.present}
                                </div>
                                ${exp.description ? `<p class="description">${exp.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }

                ${
                  personalPortfolio.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.featuredProjects}</div>
                        ${personalPortfolio
                          .map(
                            (portfolio) => `
                            <div class="portfolio-item">
                                <div class="item-title">${portfolio.name || ""}</div>
                                <p class="description">${portfolio.description || ""}</p>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }

                ${
                  achievements.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.achievementsAndAwards}</div>
                        <ul>
                            ${achievements
                              .map(
                                (ach) => `
                                <li>
                                    <strong>${ach.title || ""}</strong>${ach.year ? ` (${ach.year})` : ""} - ${ach.description || ""}
                                </li>
                            `,
                              )
                              .join("")}
                        </ul>
                    </div>
                `
                    : ""
                }
            </div>

            <div class="side-column">
                ${
                  skills.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.skills}</div>
                        ${skills
                          .map(
                            (skill) => `
                            <div class="skill-item">
                                ${skill.name || ""}${skill.level ? `<span class="skill-level">${skill.level}</span>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }

                ${
                  education.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.education}</div>
                        ${education
                          .map(
                            (edu) => `
                            <div class="education-item">
                                <div class="item-title">${edu.institution || ""}</div>
                                <div class="education-degree">${edu.degree || ""}${edu.major ? ` in ${edu.major}` : ""}</div>
                                <div class="date-range">
                                    ${edu.fromYear || ""} - ${edu.toYear || i18n.present}
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        </div>
    </div>
</div>
</body>
</html>`;
}

/**
 * Generate HTML for Template 3 - Elegant minimalist serif design
 */
export function generateTemplate3Html(data: TemplateData): string {
  const {
    name = "",
    surname = "",
    title = "",
    profileDescription,
    email,
    website,
    linkedIn,
    gitHub,
    education = [],
    skills = [],
    workExperience = [],
    achievements = [],
    personalPortfolio = [],
    profileImage,
    language,
  } = data;

  const i18n: TemplateMessages = getTemplateMessages(language);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${name} ${surname}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        .container {
            width: 100%;
            min-height: 100%;
            padding: 40px;
            box-sizing: border-box;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #fff;
            color: #1a1a1a;
            height: 100%;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #1a1a1a;
        }

        .profile-pic {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 2px solid #1a1a1a;
            margin: 0 auto 15px;
            display: block;
            object-fit: cover;
        }

        .header h1 {
            font-size: 28px;
            margin: 0 0 5px 0;
            font-weight: 400;
            letter-spacing: 3px;
            text-transform: uppercase;
        }

        .header h2 {
            font-size: 14px;
            margin: 0 0 15px 0;
            font-weight: 300;
            color: #666;
            letter-spacing: 1px;
        }

        .contact-info {
            font-size: 10px;
            color: #666;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }

        .contact-info span {
            margin: 0 7px 7px 7px;
        }

        .contact-info a {
            color: #1a1a1a;
            text-decoration: none;
            border-bottom: 1px solid #ccc;
        }

        .contact-info a:hover {
            border-bottom: 1px solid #1a1a1a;
        }

        .section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            color: #1a1a1a;
        }

        .profile-text {
            font-size: 11px;
            line-height: 1.8;
            color: #333;
            text-align: justify;
            font-style: italic;
        }

        .experience-item,
        .portfolio-item,
        .education-item {
            margin-bottom: 20px;
            padding-left: 20px;
            border-left: 2px solid #e0e0e0;
        }

        .item-header {
            display: flex;
            margin-bottom: 5px;
        }

        .item-title {
            font-size: 12px;
            font-weight: 700;
            color: #1a1a1a;
            margin-right: 10px;
        }

        .date-range {
            font-size: 9px;
            color: #999;
            font-style: italic;
            white-space: nowrap;
        }

        .item-subtitle {
            font-size: 11px;
            color: #666;
            margin-bottom: 5px;
        }

        .description {
            font-size: 10px;
            color: #444;
            line-height: 1.7;
            text-align: justify;
            margin-top: 8px;
        }

        .skills-grid {
            display: flex;
            flex-wrap: wrap;
        }

        .skill-item {
            font-size: 10px;
            padding: 6px 12px;
            border: 1px solid #1a1a1a;
            color: #1a1a1a;
            margin: 0 10px 10px 0;
        }

        .skill-level {
            font-size: 8px;
            color: #666;
            margin-left: 6px;
        }

        .education-grid {
            display: flex;
            flex-wrap: wrap;
        }

        .education-item {
            flex: 1;
            min-width: 200px;
            margin-right: 20px;
            margin-bottom: 20px;
        }

        .education-degree {
            font-size: 10px;
            color: #666;
            margin-bottom: 3px;
        }

        ul {
            margin: 0;
            padding-left: 20px;
        }

        li {
            font-size: 10px;
            line-height: 1.7;
            margin-bottom: 8px;
            color: #444;
        }

        li strong {
            color: #1a1a1a;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        ${profileImage ? `<img src="${profileImage}" alt="Profile Picture" class="profile-pic">` : ""}
        <h1>${name} ${surname}</h1>
        <h2>${title}</h2>
        <div class="contact-info">
            ${email ? `<span>${email}</span>` : ""}
            ${website ? `<span><a href="${website}" target="_blank">${website}</a></span>` : ""}
            ${linkedIn ? `<span><a href="${linkedIn}" target="_blank">${i18n.linkedin}</a></span>` : ""}
            ${gitHub ? `<span><a href="${gitHub}" target="_blank">${i18n.github}</a></span>` : ""}
        </div>
    </div>

    ${
      profileDescription
        ? `
        <div class="section">
            <div class="section-title">${i18n.about}</div>
            <p class="profile-text">${profileDescription}</p>
        </div>
    `
        : ""
    }

    ${
      workExperience.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.experience}</div>
            ${workExperience
              .map(
                (exp) => `
                <div class="experience-item">
                    <div class="item-header">
                        <div class="item-title">${exp.position || ""}</div>
                        <div class="date-range">
                            ${formatDate(exp.startDate, language)} - ${exp.endDate ? formatDate(exp.endDate, language) : i18n.present}
                        </div>
                    </div>
                    <div class="item-subtitle">${exp.company || ""}</div>
                    ${exp.description ? `<p class="description">${exp.description}</p>` : ""}
                </div>
            `,
              )
              .join("")}
        </div>
    `
        : ""
    }

    ${
      personalPortfolio.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.projects}</div>
            ${personalPortfolio
              .map(
                (portfolio) => `
                <div class="portfolio-item">
                    <div class="item-title">${portfolio.name || ""}</div>
                    <p class="description">${portfolio.description || ""}</p>
                </div>
            `,
              )
              .join("")}
        </div>
    `
        : ""
    }

    ${
      skills.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.skills}</div>
            <div class="skills-grid">
                ${skills
                  .map(
                    (skill) => `
                    <div class="skill-item">
                        ${skill.name || ""}
                        ${skill.level ? `<span class="skill-level">${skill.level}</span>` : ""}
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
        : ""
    }

    ${
      education.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.education}</div>
            <div class="education-grid">
                ${education
                  .map(
                    (edu) => `
                    <div class="education-item">
                        <div class="item-title">${edu.institution || ""}</div>
                        <div class="education-degree">
                            ${edu.degree || ""}${edu.major ? ` in ${edu.major}` : ""}
                        </div>
                        <div class="date-range">
                            ${edu.fromYear || ""} - ${edu.toYear || i18n.present}
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
        : ""
    }

    ${
      achievements.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.achievements}</div>
            <ul>
                ${achievements
                  .map(
                    (ach) => `
                    <li>
                        <strong>${ach.title || ""}</strong>
                        ${ach.year ? ` (${ach.year})` : ""}
                        - ${ach.description || ""}
                    </li>
                `,
                  )
                  .join("")}
            </ul>
        </div>
    `
        : ""
    }
</div>
</body>
</html>`;
}

/**
 * Generate HTML for Template 4 - Modern gradient with cards design
 */
export function generateTemplate4Html(data: TemplateData): string {
  const {
    name = "",
    surname = "",
    title = "",
    profileDescription,
    email,
    website,
    linkedIn,
    gitHub,
    education = [],
    skills = [],
    workExperience = [],
    achievements = [],
    personalPortfolio = [],
    profileImage,
    language,
  } = data;

  const i18n: TemplateMessages = getTemplateMessages(language);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${name} ${surname}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        .container {
            width: 100%;
            min-height: 100%;
            box-sizing: border-box;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 10px;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Trebuchet MS', 'Arial', sans-serif;
            background: #fff;
            color: #333;
            height: 100%;
        }

        .inner-container {
            background: #fff;
            padding: 30px;
            min-height: calc(100% - 20px);
        }

        .header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
        }

        .profile-pic {
            width: 120px;
            height: 120px;
            border-radius: 10px;
            border: 4px solid #667eea;
            object-fit: cover;
            flex-shrink: 0;
            margin-right: 25px;
        }

        .header-text {
            flex: 1;
        }

        .header h1 {
            font-size: 30px;
            margin: 0 0 8px 0;
            font-weight: 800;
            color: #667eea;
            letter-spacing: 1px;
        }

        .header h2 {
            font-size: 16px;
            margin: 0 0 12px 0;
            font-weight: 400;
            color: #764ba2;
        }

        .contact-chips {
            display: flex;
            flex-wrap: wrap;
        }

        .chip {
            font-size: 9px;
            padding: 5px 10px;
            background: #f0f0ff;
            border-radius: 15px;
            color: #667eea;
            border: 1px solid #667eea;
            margin: 0 10px 10px 0;
        }

        .chip a {
            color: #667eea;
            text-decoration: none;
        }

        .section {
            margin-bottom: 25px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 800;
            color: #fff;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            padding: 8px 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }

        .profile-text {
            font-size: 11px;
            line-height: 1.7;
            color: #555;
            text-align: justify;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .two-column {
            display: flex;
        }

        .main-column {
            flex: 1.5;
            margin-right: 25px;
        }

        .side-column {
            flex: 1;
        }

        .experience-item,
        .portfolio-item {
            margin-bottom: 18px;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
            border-left: 4px solid #764ba2;
        }

        .item-title {
            font-size: 12px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 4px;
        }

        .item-subtitle {
            font-size: 11px;
            color: #764ba2;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .date-range {
            font-size: 9px;
            color: #999;
            font-style: italic;
            margin-bottom: 8px;
        }

        .description {
            font-size: 10px;
            color: #555;
            line-height: 1.6;
            text-align: justify;
        }

        .skills-list {
            display: flex;
            flex-wrap: wrap;
        }

        .skill-badge {
            font-size: 9px;
            padding: 6px 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border-radius: 20px;
            font-weight: 600;
            margin: 0 8px 8px 0;
        }

        .skill-level {
            font-size: 8px;
            opacity: 0.9;
            margin-left: 4px;
        }

        .education-item {
            margin-bottom: 15px;
            padding: 12px;
            background: #f0f0ff;
            border-radius: 8px;
            border: 1px solid #667eea;
        }

        .education-title {
            font-size: 11px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 3px;
        }

        .education-degree {
            font-size: 10px;
            color: #764ba2;
            font-weight: 600;
            margin-bottom: 3px;
        }

        .achievement-list {
            margin: 0;
            padding-left: 20px;
        }

        .achievement-list li {
            font-size: 10px;
            line-height: 1.6;
            margin-bottom: 10px;
            color: #555;
        }

        .achievement-list strong {
            color: #667eea;
            font-weight: 700;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="inner-container">
        <div class="header">
            ${profileImage ? `<img src="${profileImage}" alt="Profile Picture" class="profile-pic">` : ""}
            <div class="header-text">
                <h1>${name} ${surname}</h1>
                <h2>${title}</h2>
                <div class="contact-chips">
                    ${email ? `<div class="chip">📧 ${email}</div>` : ""}
                    ${website ? `<div class="chip">🌐 <a href="${website}" target="_blank">${i18n.website}</a></div>` : ""}
                    ${linkedIn ? `<div class="chip">🔗 <a href="${linkedIn}" target="_blank">${i18n.linkedin}</a></div>` : ""}
                    ${gitHub ? `<div class="chip">🐱 <a href="${gitHub}" target="_blank">${i18n.github}</a></div>` : ""}
                </div>
            </div>
        </div>

        ${
          profileDescription
            ? `
            <div class="section">
                <div class="section-title">${i18n.aboutMe}</div>
                <p class="profile-text">${profileDescription}</p>
            </div>
        `
            : ""
        }

        <div class="two-column">
            <div class="main-column">
                ${
                  workExperience.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.workExperience}</div>
                        ${workExperience
                          .map(
                            (exp) => `
                            <div class="experience-item">
                                <div class="item-title">${exp.position || ""}</div>
                                <div class="item-subtitle">${exp.company || ""}</div>
                                <div class="date-range">
                                    ${formatDate(exp.startDate, language)} - ${exp.endDate ? formatDate(exp.endDate, language) : i18n.present}
                                </div>
                                ${exp.description ? `<p class="description">${exp.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }

                ${
                  personalPortfolio.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.featuredProjects}</div>
                        ${personalPortfolio
                          .map(
                            (portfolio) => `
                            <div class="portfolio-item">
                                <div class="item-title">${portfolio.name || ""}</div>
                                <p class="description">${portfolio.description || ""}</p>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }

                ${
                  achievements.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.achievements}</div>
                        <ul class="achievement-list">
                            ${achievements
                              .map(
                                (ach) => `
                                <li>
                                    <strong>${ach.title || ""}</strong>
                                    ${ach.year ? ` (${ach.year})` : ""}
                                    - ${ach.description || ""}
                                </li>
                            `,
                              )
                              .join("")}
                        </ul>
                    </div>
                `
                    : ""
                }
            </div>

            <div class="side-column">
                ${
                  skills.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.skills}</div>
                        <div class="skills-list">
                            ${skills
                              .map(
                                (skill) => `
                                <div class="skill-badge">
                                    ${skill.name || ""}
                                    ${skill.level ? `<span class="skill-level">${skill.level}</span>` : ""}
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }

                ${
                  education.length > 0
                    ? `
                    <div class="section">
                        <div class="section-title">${i18n.education}</div>
                        ${education
                          .map(
                            (edu) => `
                            <div class="education-item">
                                <div class="education-title">${edu.institution || ""}</div>
                                <div class="education-degree">
                                    ${edu.degree || ""}${edu.major ? ` in ${edu.major}` : ""}
                                </div>
                                <div class="date-range">
                                    ${edu.fromYear || ""} - ${edu.toYear || i18n.present}
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        </div>
    </div>
</div>
</body>
</html>`;
}

/**
 * Generate HTML for Template 5 - Classic professional design
 */
export function generateTemplate5Html(data: TemplateData): string {
  const {
    name = "",
    surname = "",
    title = "",
    profileDescription,
    email,
    website,
    linkedIn,
    gitHub,
    education = [],
    skills = [],
    workExperience = [],
    achievements = [],
    personalPortfolio = [],
    profileImage,
    language,
  } = data;

  const i18n: TemplateMessages = getTemplateMessages(language);

  // Build contact line with separators
  const contactParts = [
    email,
    website
      ? `<a href="${website}" target="_blank">${website}</a>`
      : null,
    linkedIn
      ? `<a href="${linkedIn}" target="_blank">${i18n.linkedin}</a>`
      : null,
    gitHub
      ? `<a href="${gitHub}" target="_blank">${i18n.github}</a>`
      : null,
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${name} ${surname}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        .container {
            width: 100%;
            min-height: 100%;
            padding: 40px 50px;
            box-sizing: border-box;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Times New Roman', serif;
            background: #fff;
            color: #000;
            height: 100%;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
        }

        .profile-pic {
            width: 90px;
            height: 90px;
            border-radius: 0;
            border: 2px solid #000;
            margin: 0 auto 15px;
            display: block;
            object-fit: cover;
        }

        .header h1 {
            font-size: 24px;
            margin: 0 0 5px 0;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .header h2 {
            font-size: 14px;
            margin: 0 0 10px 0;
            font-weight: 400;
            font-style: italic;
        }

        .contact-line {
            font-size: 10px;
            color: #333;
            line-height: 1.5;
        }

        .contact-line a {
            color: #000;
            text-decoration: none;
            border-bottom: 1px solid #000;
        }

        .section {
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #000;
            color: #000;
        }

        .profile-text {
            font-size: 11px;
            line-height: 1.7;
            color: #000;
            text-align: justify;
        }

        .experience-item,
        .portfolio-item,
        .education-item {
            margin-bottom: 15px;
        }

        .item-header {
            display: flex;
            margin-bottom: 3px;
        }

        .item-header > div:first-child {
            flex: 1;
        }

        .date-range {
            font-size: 10px;
            color: #333;
            margin-left: 15px;
            white-space: nowrap;
        }

        .item-title {
            font-size: 11px;
            font-weight: 700;
            color: #000;
        }

        .item-subtitle {
            font-size: 11px;
            color: #000;
            font-style: italic;
            margin-bottom: 3px;
        }

        .description {
            font-size: 10px;
            color: #000;
            line-height: 1.6;
            text-align: justify;
            margin-top: 5px;
        }

        .skills-section {
            columns: 2;
            column-gap: 20px;
        }

        .skill-item {
            font-size: 10px;
            margin-bottom: 5px;
            color: #000;
            break-inside: avoid;
        }

        .skill-level {
            font-size: 9px;
            color: #333;
            margin-left: 5px;
        }

        .education-grid {
            display: block;
        }

        .education-degree {
            font-size: 10px;
            font-style: italic;
            margin-bottom: 3px;
        }

        ul {
            margin: 5px 0;
            padding-left: 25px;
        }

        li {
            font-size: 10px;
            line-height: 1.6;
            margin-bottom: 6px;
            color: #000;
        }

        li strong {
            font-weight: 700;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        ${profileImage ? `<img src="${profileImage}" alt="Profile Picture" class="profile-pic">` : ""}
        <h1>${name} ${surname}</h1>
        <h2>${title}</h2>
        <div class="contact-line">
            ${contactParts.join(" • ")}
        </div>
    </div>

    ${
      profileDescription
        ? `
        <div class="section">
            <div class="section-title">${i18n.professionalSummary}</div>
            <p class="profile-text">${profileDescription}</p>
        </div>
    `
        : ""
    }

    ${
      workExperience.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.professionalExperience}</div>
            ${workExperience
              .map(
                (exp) => `
                <div class="experience-item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${exp.position || ""}</div>
                            <div class="item-subtitle">${exp.company || ""}</div>
                        </div>
                        <div class="date-range">
                            ${formatDate(exp.startDate, language)} - ${exp.endDate ? formatDate(exp.endDate, language) : i18n.present}
                        </div>
                    </div>
                    ${exp.description ? `<p class="description">${exp.description}</p>` : ""}
                </div>
            `,
              )
              .join("")}
        </div>
    `
        : ""
    }

    ${
      education.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.education}</div>
            <div class="education-grid">
                ${education
                  .map(
                    (edu) => `
                    <div class="education-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${edu.institution || ""}</div>
                                <div class="education-degree">
                                    ${edu.degree || ""}${edu.major ? ` in ${edu.major}` : ""}
                                </div>
                            </div>
                            <div class="date-range">
                                ${edu.fromYear || ""} - ${edu.toYear || i18n.present}
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
        : ""
    }

    ${
      skills.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.skillsAndCompetencies}</div>
            <div class="skills-section">
                ${skills
                  .map(
                    (skill) => `
                    <div class="skill-item">
                        • ${skill.name || ""}
                        ${skill.level ? `<span class="skill-level">(${skill.level})</span>` : ""}
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
        : ""
    }

    ${
      personalPortfolio.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.projectsAndPortfolio}</div>
            ${personalPortfolio
              .map(
                (portfolio) => `
                <div class="portfolio-item">
                    <div class="item-title">${portfolio.name || ""}</div>
                    <p class="description">${portfolio.description || ""}</p>
                </div>
            `,
              )
              .join("")}
        </div>
    `
        : ""
    }

    ${
      achievements.length > 0
        ? `
        <div class="section">
            <div class="section-title">${i18n.honorsAndAchievements}</div>
            <ul>
                ${achievements
                  .map(
                    (ach) => `
                    <li>
                        <strong>${ach.title || ""}</strong>
                        ${ach.year ? `, ${ach.year}` : ""}:
                        ${ach.description || ""}
                    </li>
                `,
                  )
                  .join("")}
            </ul>
        </div>
    `
        : ""
    }
</div>
</body>
</html>`;
}

/**
 * Get the appropriate template generator based on template version
 */
export function generateTemplateHtml(
  templateVersion: number,
  data: TemplateData,
): string {
  switch (templateVersion) {
    case 1:
      return generateTemplate1Html(data);
    case 2:
      return generateTemplate2Html(data);
    case 3:
      return generateTemplate3Html(data);
    case 4:
      return generateTemplate4Html(data);
    case 5:
      return generateTemplate5Html(data);
    default:
      return generateTemplate1Html(data);
  }
}
