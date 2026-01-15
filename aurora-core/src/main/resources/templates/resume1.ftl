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
            display: flex;
            box-sizing: border-box;
            page-break-after: always;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background: #fff;
            color: #333;
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
        }

        .profile-pic {
            width: 100%;
            max-width: 180px;
            border-radius: 6px;
            margin-bottom: 25px;
            border: 3px solid #fff;
            display: block;
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
        <#if profileImage?has_content>
            <img src="${profileImage}" alt="Profile Picture" class="profile-pic">
        </#if>

        <#if email?has_content || website?has_content || linkedIn?has_content || gitHub?has_content>
            <div class="section-title">Contact</div>
            <#if email?has_content>
                <div class="contact-item">📧<span>${email}</span></div>
            </#if>
            <#if website?has_content>
                <div class="contact-item">🌐<span><a href="${website}" target="_blank">Portfolio</a></span></div>
            </#if>
            <#if linkedIn?has_content>
                <div class="social-item">🔗<span><a href="${linkedIn}" target="_blank">LinkedIn</a></span></div>
            </#if>
            <#if gitHub?has_content>
                <div class="social-item">🐱<span><a href="${gitHub}" target="_blank">GitHub</a></span></div>
            </#if>
        </#if>

        <#if education?has_content>
            <div class="section-title">Education</div>
            <#list education![] as edu>
                <div class="education-item">
                    <div class="mt-small bold">${edu.institution!''}</div>
                    <div class="mt-tiny">${edu.degree!''}<#if edu.major?has_content> in ${edu.major}</#if></div>
                    <div class="date-range">${edu.fromYear?c!''} - <#if edu.toYear?has_content>${edu.toYear?c}<#else>Present</#if></div>
                </div>
            </#list>
        </#if>

        <#if skills?has_content>
            <div class="section-title">Skills</div>
            <ul>
                <#list skills![] as skill>
                    <li>${skill.name!''}<#if skill.level?has_content> <span class="skill-level">(${skill.level})</span></#if></li>
                </#list>
            </ul>
        </#if>
    </div>

    <div class="right">
        <h1>${name!''} ${surname!''}</h1>
        <h2>${title!''}</h2>

        <#if profileDescription?has_content>
            <div class="section-title">Profile</div>
            <p>${profileDescription}</p>
        </#if>

        <#if experiences?has_content>
            <div class="section-title">Work Experience</div>
            <#list experiences![] as exp>
                <div class="experience-item">
                    <div class="bold">${exp.position!''}</div>
                    <div class="mt-tiny">${exp.company!''}</div>
                    <div class="date-range">
                        ${exp.startDate} - <#if exp.endDate?has_content>${exp.endDate}<#else>Present</#if>
                    </div>
                    <#if exp.description?has_content>
                        <p class="description">${exp.description}</p>
                    </#if>
                </div>
            </#list>
        </#if>

        <#if personalPortfolio?has_content>
            <div class="section-title">Projects</div>
            <#list personalPortfolio![] as portfolio>
                <div class="portfolio-item">
                    <div class="bold">${portfolio.name!''}</div>
                    <p class="description">${portfolio.description!''}</p>
                </div>
            </#list>
        </#if>

        <#if achievements?has_content>
            <div class="section-title">Achievements</div>
            <ul>
                <#list achievements![] as ach>
                    <li class="mt-small">
                        <span class="bold">${ach.title!''}</span>
                        <#if ach.year?has_content> (${ach.year?c})</#if> - ${ach.description!''}
                    </li>
                </#list>
            </ul>
        </#if>
    </div>
</div>
</body>
</html>
