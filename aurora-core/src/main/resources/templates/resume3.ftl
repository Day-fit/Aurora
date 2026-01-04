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
            padding: 40px;
            box-sizing: border-box;
            page-break-after: always;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #fff;
            color: #1a1a1a;
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
            gap: 15px;
            flex-wrap: wrap;
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

        .experience-item, .portfolio-item, .education-item {
            margin-bottom: 20px;
            padding-left: 20px;
            border-left: 2px solid #e0e0e0;
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
        }

        .item-title {
            font-size: 12px;
            font-weight: 700;
            color: #1a1a1a;
        }

        .item-subtitle {
            font-size: 11px;
            color: #666;
            margin-bottom: 5px;
        }

        .date-range {
            font-size: 9px;
            color: #999;
            font-style: italic;
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
            gap: 10px;
        }

        .skill-item {
            font-size: 10px;
            padding: 6px 12px;
            border: 1px solid #1a1a1a;
            border-radius: 0;
            color: #1a1a1a;
        }

        .skill-level {
            font-size: 8px;
            color: #666;
            margin-left: 6px;
        }

        .education-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        .education-item {
            flex: 1;
            min-width: 200px;
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
        <#if profileImage?has_content>
            <img src="${profileImage}" alt="Profile Picture" class="profile-pic">
        </#if>
        <h1>${name!''} ${surname!''}</h1>
        <h2>${title!''}</h2>
        <div class="contact-info">
            <#if email?has_content>
                <span>${email}</span>
            </#if>
            <#if website?has_content>
                <span><a href="${website}" target="_blank">${website}</a></span>
            </#if>
            <#if linkedIn?has_content>
                <span><a href="${linkedIn}" target="_blank">LinkedIn</a></span>
            </#if>
            <#if gitHub?has_content>
                <span><a href="${gitHub}" target="_blank">GitHub</a></span>
            </#if>
        </div>
    </div>

    <#if profileDescription?has_content>
        <div class="section">
            <div class="section-title">About</div>
            <p class="profile-text">${profileDescription}</p>
        </div>
    </#if>

    <#if experiences?has_content>
        <div class="section">
            <div class="section-title">Experience</div>
            <#list experiences![] as exp>
                <div class="experience-item">
                    <div class="item-header">
                        <div class="item-title">${exp.position!''}</div>
                        <div class="date-range">
                            ${exp.startDate?string["MMM yyyy"]} - <#if exp.endDate?has_content>${exp.endDate?string["MMM yyyy"]}<#else>Present</#if>
                        </div>
                    </div>
                    <div class="item-subtitle">${exp.company!''}</div>
                    <#if exp.description?has_content>
                        <p class="description">${exp.description}</p>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>

    <#if personalPortfolio?has_content>
        <div class="section">
            <div class="section-title">Projects</div>
            <#list personalPortfolio![] as portfolio>
                <div class="portfolio-item">
                    <div class="item-title">${portfolio.name!''}</div>
                    <p class="description">${portfolio.description!''}</p>
                </div>
            </#list>
        </div>
    </#if>

    <#if skills?has_content>
        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-grid">
                <#list skills![] as skill>
                    <div class="skill-item">
                        ${skill.name!''}<#if skill.level?has_content><span class="skill-level">${skill.level}</span></#if>
                    </div>
                </#list>
            </div>
        </div>
    </#if>

    <#if education?has_content>
        <div class="section">
            <div class="section-title">Education</div>
            <div class="education-grid">
                <#list education![] as edu>
                    <div class="education-item">
                        <div class="item-title">${edu.institution!''}</div>
                        <div class="education-degree">${edu.degree!''}<#if edu.major?has_content> in ${edu.major}</#if></div>
                        <div class="date-range">${edu.fromYear!''} - <#if edu.toYear?has_content>${edu.toYear}<#else>Present</#if></div>
                    </div>
                </#list>
            </div>
        </div>
    </#if>

    <#if achievements?has_content>
        <div class="section">
            <div class="section-title">Achievements</div>
            <ul>
                <#list achievements![] as ach>
                    <li>
                        <strong>${ach.title!''}</strong><#if ach.year?has_content> (${ach.year})</#if> - ${ach.description!''}
                    </li>
                </#list>
            </ul>
        </div>
    </#if>
</div>
</body>
</html>
