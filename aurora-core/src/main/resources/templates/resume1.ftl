<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=210mm, height=297mm">
    <title>${name} ${surname}</title>
    <style>
        @page { size: A4; margin:20mm; }
        body { margin:0; font-family:'Arial', sans-serif; background:#fff; color:#333; }
        .container { display:flex; height:257mm; border:1px solid #ccc; border-radius:8px; overflow:hidden; }
        .left { width:35%; background:#1c7c74; color:#fff; padding:25px; box-sizing:border-box; }
        .right { width:65%; padding:25px; box-sizing:border-box; }
        .profile-pic { width:100%; border-radius:6px; margin-bottom:25px; border:3px solid #fff; }
        .section-title { font-size:12px; font-weight:bold; border-bottom:2px solid #fff; padding-bottom:5px; margin-top:20px; text-transform:uppercase; letter-spacing:1px; }
        .contact-item, .social-item { display:flex; align-items:center; margin-bottom:8px; font-size:11px; }
        .contact-item span, .social-item span { margin-left:6px; color:#fff; }
        h1 { font-size:24px; letter-spacing:1px; margin:0; }
        h2 { font-size:14px; letter-spacing:1px; margin:5px 0 20px 0; font-weight:400; color:#e0f7f7; }
        p { font-size:12px; line-height:1.5; margin:5px 0; }
        ul { padding-left:15px; margin:5px 0; }
        li { margin-bottom:3px; font-size:12px; }
        .bold { font-weight:bold; }
        .skill-level { font-size:10px; color:#ccc; margin-left:5px; }
        .mt-small { margin-top:8px; }
        a { color:#fff; text-decoration:none; }
        a:hover { text-decoration:underline; }
        .right .section-title { color:#1c7c74; border-color:#1c7c74; }
    </style>
</head>
<body>
<div class="container">

    <div class="left">
        <#if profileImage?? && profileImage?length > 0>
            <img src="${profileImage}" alt="Profile Picture" class="profile-pic">
        </#if>

        <#if email?? || website?? || linkedIn?? || gitHub??>
            <div class="section-title">Contact</div>
            <#if email?? && email?length > 0>
                <div class="contact-item">📧<span>${email}</span></div>
            </#if>
            <#if website?? && website?length > 0>
                <div class="contact-item">🌐<span><a href="${website}" target="_blank">Portfolio</a></span></div>
            </#if>
            <#if linkedIn?? && linkedIn?length > 0>
                <div class="social-item">🔗<span><a href="${linkedIn}" target="_blank">LinkedIn</a></span></div>
            </#if>
            <#if gitHub?? && gitHub?length > 0>
                <div class="social-item">🐱<span><a href="${gitHub}" target="_blank">GitHub</a></span></div>
            </#if>
        </#if>

        <#if education?? && education?size > 0>
            <div class="section-title">Education</div>
            <#list education as edu>
                <div class="mt-small bold">${edu.institution}</div>
                <div>${edu.degree} <#if edu.major??>${edu.major}</#if></div>
                <div>${edu.fromYear} - <#if edu.toYear??>${edu.toYear}<#else>Present</#if></div>
            </#list>
        </#if>

        <#if skills?? && skills?size > 0>
            <div class="section-title">Skills</div>
            <ul>
                <#list skills as skill>
                    <li>${skill.name} <span class="skill-level">(${skill.level})</span></li>
                </#list>
            </ul>
        </#if>
    </div>

    <div class="right">
        <h1>${name} ${surname}</h1>
        <h2>${title}</h2>

        <#if profileDescription?? && profileDescription?length > 0>
            <div class="section-title">Profile</div>
            <p>${profileDescription}</p>
        </#if>

        <#if experiences?? && experiences?size > 0>
            <div class="section-title">Work Experience</div>
            <#list experiences as exp>
                <div class="mt-small">
                    <div class="bold">${exp.position} at ${exp.company} | ${exp.fromYear} - <#if exp.toYear??>${exp.toYear}<#else>Present</#if></div>
                </div>
            </#list>
        </#if>

        <#if achievements?? && achievements?size > 0>
            <div class="section-title">Achievements</div>
            <ul>
                <#list achievements as ach>
                    <li class="mt-small"><span class="bold">${ach.title}</span> <#if ach.year??>(${ach.year})</#if> - ${ach.description}</li>
                </#list>
            </ul>
        </#if>
    </div>
</div>
</body>
</html>
