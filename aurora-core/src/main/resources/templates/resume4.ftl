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
            box-sizing: border-box;
            page-break-after: always;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 10px;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Trebuchet MS', 'Arial', sans-serif;
            background: #fff;
            color: #333;
        }

        .inner-container {
            background: #fff;
            padding: 30px;
            min-height: calc(297mm - 20px);
        }

        /* ===== HEADER ===== */
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
            margin-right: 25px; /* zamiast gap */
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

        /* ===== CONTACT CHIPS ===== */
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
            margin: 0 10px 10px 0; /* zamiast gap */
        }

        .chip a {
            color: #667eea;
            text-decoration: none;
        }

        /* ===== SECTIONS ===== */
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

        /* ===== TWO COLUMN ===== */
        .two-column {
            display: flex;
        }

        .main-column {
            flex: 1.5;
            margin-right: 25px; /* zamiast gap */
        }

        .side-column {
            flex: 1;
        }

        /* ===== EXPERIENCE / PORTFOLIO ===== */
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

        /* ===== SKILLS ===== */
        .skill-category {
            margin-bottom: 15px;
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
            margin: 0 8px 8px 0; /* zamiast gap */
        }

        .skill-level {
            font-size: 8px;
            opacity: 0.9;
            margin-left: 4px;
        }

        /* ===== EDUCATION ===== */
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

        /* ===== ACHIEVEMENTS ===== */
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
            <#if profileImage?has_content>
                <img src="${profileImage}" alt="Profile Picture" class="profile-pic">
            </#if>
            <div class="header-text">
                <h1>${name!''} ${surname!''}</h1>
                <h2>${title!''}</h2>
                <div class="contact-chips">
                    <#if email?has_content><div class="chip">📧 ${email}</div></#if>
                    <#if website?has_content><div class="chip">🌐 <a href="${website}" target="_blank">Website</a></div></#if>
                    <#if linkedIn?has_content><div class="chip">🔗 <a href="${linkedIn}" target="_blank">LinkedIn</a></div></#if>
                    <#if gitHub?has_content><div class="chip">🐱 <a href="${gitHub}" target="_blank">GitHub</a></div></#if>
                </div>
            </div>
        </div>

        <#if profileDescription?has_content>
            <div class="section">
                <div class="section-title">About Me</div>
                <p class="profile-text">${profileDescription}</p>
            </div>
        </#if>

        <div class="two-column">
            <div class="main-column">
                <#if experiences?has_content>
                    <div class="section">
                        <div class="section-title">Work Experience</div>
                        <#list experiences![] as exp>
                            <div class="experience-item">
                                <div class="item-title">${exp.position!''}</div>
                                <div class="item-subtitle">${exp.company!''}</div>
                                <div class="date-range">
                                    <#if exp.startDate?has_content>
                                        ${exp.startDate?datetime("yyyy-MM-dd'T'HH:mm:ssX")?string("MMM yyyy")}
                                    </#if>
                                    -
                                    <#if exp.endDate?has_content>
                                        ${exp.endDate?datetime("yyyy-MM-dd'T'HH:mm:ssX")?string("MMM yyyy")}
                                    <#else>Present</#if>
                                </div>
                                <#if exp.description?has_content>
                                    <p class="description">${exp.description}</p>
                                </#if>
                            </div>
                        </#list>
                    </div>
                </#if>

                <#if personalPortfolio?has_content>
                    <div class="section">
                        <div class="section-title">Featured Projects</div>
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
                        <div class="section-title">Achievements</div>
                        <ul class="achievement-list">
                            <#list achievements![] as ach>
                                <li>
                                    <strong>${ach.title!''}</strong>
                                    <#if ach.year?has_content> (${ach.year?c})</#if>
                                    - ${ach.description!''}
                                </li>
                            </#list>
                        </ul>
                    </div>
                </#if>
            </div>

            <div class="side-column">
                <#if skills?has_content>
                    <div class="section">
                        <div class="section-title">Skills</div>
                        <div class="skill-category">
                            <div class="skills-list">
                                <#list skills![] as skill>
                                    <div class="skill-badge">
                                        ${skill.name!''}
                                        <#if skill.level?has_content>
                                            <span class="skill-level">${skill.level}</span>
                                        </#if>
                                    </div>
                                </#list>
                            </div>
                        </div>
                    </div>
                </#if>

                <#if education?has_content>
                    <div class="section">
                        <div class="section-title">Education</div>
                        <#list education![] as edu>
                            <div class="education-item">
                                <div class="education-title">${edu.institution!''}</div>
                                <div class="education-degree">
                                    ${edu.degree!''}<#if edu.major?has_content> in ${edu.major}</#if>
                                </div>
                                <div class="date-range">
                                    <#if edu.fromYear?has_content>${edu.fromYear?c}</#if>
                                    -
                                    <#if edu.toYear?has_content>${edu.toYear?c}<#else>Present</#if>
                                </div>
                            </div>
                        </#list>
                    </div>
                </#if>
            </div>
        </div>
    </div>
</div>
</body>
</html>
