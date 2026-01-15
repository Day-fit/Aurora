<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${name!''} ${surname!''}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        .container {
            width: 210mm;
            min-height: 297mm;
            padding: 40px 50px;
            box-sizing: border-box;
            page-break-after: always;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Times New Roman', serif;
            background: #fff;
            color: #000;
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

        /* ===== FIXED FLEX HEADER ===== */
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

        /* ===== SKILLS (columns OK) ===== */
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
        <#if profileImage?has_content>
            <img src="${profileImage}" alt="Profile Picture" class="profile-pic">
        </#if>
        <h1>${name!''} ${surname!''}</h1>
        <h2>${title!''}</h2>
        <div class="contact-line">
            <#if email?has_content>${email}</#if>
            <#if website?has_content>
                <#if email?has_content> • </#if><a href="${website}" target="_blank">${website}</a>
            </#if>
            <#if linkedIn?has_content>
                <#if email?has_content || website?has_content> • </#if><a href="${linkedIn}" target="_blank">LinkedIn</a>
            </#if>
            <#if gitHub?has_content>
                <#if email?has_content || website?has_content || linkedIn?has_content> • </#if><a href="${gitHub}" target="_blank">GitHub</a>
            </#if>
        </div>
    </div>

    <#if profileDescription?has_content>
        <div class="section">
            <div class="section-title">Professional Summary</div>
            <p class="profile-text">${profileDescription}</p>
        </div>
    </#if>

    <#if experiences?has_content>
        <div class="section">
            <div class="section-title">Professional Experience</div>
            <#list experiences![] as exp>
                <div class="experience-item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${exp.position!''}</div>
                            <div class="item-subtitle">${exp.company!''}</div>
                        </div>
                        <div class="date-range">
                            <#if exp.startDate?has_content>
                                ${exp.startDate}
                            </#if>
                            -
                            <#if exp.endDate?has_content>
                                ${exp.endDate}
                            <#else>Present</#if>
                        </div>
                    </div>
                    <#if exp.description?has_content>
                        <p class="description">${exp.description}</p>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>

    <#if education?has_content>
        <div class="section">
            <div class="section-title">Education</div>
            <div class="education-grid">
                <#list education![] as edu>
                    <div class="education-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${edu.institution!''}</div>
                                <div class="education-degree">
                                    ${edu.degree!''}<#if edu.major?has_content> in ${edu.major}</#if>
                                </div>
                            </div>
                            <div class="date-range">
                                <#if edu.fromYear?has_content>${edu.fromYear?c}</#if>
                                -
                                <#if edu.toYear?has_content>${edu.toYear?c}<#else>Present</#if>
                            </div>
                        </div>
                    </div>
                </#list>
            </div>
        </div>
    </#if>

    <#if skills?has_content>
        <div class="section">
            <div class="section-title">Skills & Competencies</div>
            <div class="skills-section">
                <#list skills![] as skill>
                    <div class="skill-item">
                        • ${skill.name!''}
                        <#if skill.level?has_content>
                            <span class="skill-level">(${skill.level})</span>
                        </#if>
                    </div>
                </#list>
            </div>
        </div>
    </#if>

    <#if personalPortfolio?has_content>
        <div class="section">
            <div class="section-title">Projects & Portfolio</div>
            <#list personalPortfolio![] as portfolio>
                <div class="portfolio-item">
                    <div class="item-title">${portfolio.name!''}</div>
                    <p class="description">${portfolio.description!''}</p>
                </div>
            </#list>
        </div>
    </#if>

    <#if achievements?has_content>
        <div class="section">
            <div class="section-title">Honors & Achievements</div>
            <ul>
                <#list achievements![] as ach>
                    <li>
                        <strong>${ach.title!''}</strong>
                        <#if ach.year?has_content>, ${ach.year?c}</#if>:
                        ${ach.description!''}
                    </li>
                </#list>
            </ul>
        </div>
    </#if>
</div>
</body>
</html>
