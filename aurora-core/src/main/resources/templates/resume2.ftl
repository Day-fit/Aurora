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
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica', 'Arial', sans-serif;
            background: #fff;
            color: #2c3e50;
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
        <#if profileImage?has_content>
            <img src="${profileImage}" alt="Profile Picture" class="profile-pic">
        </#if>
        <h1>${name!''} ${surname!''}</h1>
        <h2>${title!''}</h2>
    </div>

    <div class="contact-bar">
        <#if email?has_content>
            <div class="contact-item">📧 ${email}</div>
        </#if>
        <#if website?has_content>
            <div class="contact-item">🌐 <a href="${website}" target="_blank">${website}</a></div>
        </#if>
        <#if linkedIn?has_content>
            <div class="contact-item">🔗 <a href="${linkedIn}" target="_blank">LinkedIn</a></div>
        </#if>
        <#if gitHub?has_content>
            <div class="contact-item">🐱 <a href="${gitHub}" target="_blank">GitHub</a></div>
        </#if>
    </div>

    <div class="content">
        <div class="two-column">
            <div class="main-column">
                <#if profileDescription?has_content>
                    <div class="section">
                        <div class="section-title">Professional Summary</div>
                        <p class="profile-text">${profileDescription}</p>
                    </div>
                </#if>

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
                                    <#else>
                                        Present
                                    </#if>
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
                        <div class="section-title">Achievements & Awards</div>
                        <ul>
                            <#list achievements![] as ach>
                                <li>
                                    <strong>${ach.title!''}</strong><#if ach.year?has_content> (${ach.year?c})</#if> - ${ach.description!''}
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
                        <#list skills![] as skill>
                            <div class="skill-item">
                                ${skill.name!''}<#if skill.level?has_content><span class="skill-level">${skill.level}</span></#if>
                            </div>
                        </#list>
                    </div>
                </#if>

                <#if education?has_content>
                    <div class="section">
                        <div class="section-title">Education</div>
                        <#list education![] as edu>
                            <div class="education-item">
                                <div class="item-title">${edu.institution!''}</div>
                                <div class="education-degree">${edu.degree!''}<#if edu.major?has_content> in ${edu.major}</#if></div>
                                <div class="date-range">
                                    <#if edu.fromYear?has_content>
                                        ${edu.fromYear?c}
                                    </#if>
                                    -
                                    <#if edu.toYear?has_content>
                                        ${edu.toYear?c}
                                    <#else>
                                        Present
                                    </#if>
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
