![alt tag](https://cloud.githubusercontent.com/assets/24201238/24583976/ced4c43e-179f-11e7-9c40-c0988c346f55.png)

_**Publish research for free, access research for free.**_

# Submission Smart Contract Definition

Welcome to Etherpad!

This pad text is synchronized as you type, so that everyone viewing this page sees the same text. This allows you to collaborate seamlessly on documents!

Get involved with Etherpad at http://etherpad.org

Aletheia submission contract

User submit a paper
Initial options from the submission screen

     I am one of the authors / I am not one of the authors authors - Note: authorship is to assist with reputation flowing back to authors. People can lie, but the authorship is tied to the user account that's tied to the ORCID so will be possible to track false attributions. If a number of users flag a false attribution that use will have reputation taken away from them - Question: Will we recognise through token or score or some other mechanism

    Reputation given to a paper flows back to the author

    Note: false attributions need to be handled

    Community vote to find false attributions

    Reverse reputation gained for false attribution

    Peer review / no peer review - Note: paper may already be peer reviewed or might not want peer review, it is the submitter's choice

    Whether the submitter marks themselves as the author or not does not impact the flow of the paper. the peer review option does.

If no peer review is chosen paper moves to vote of acceptance by community
Communities/Overlay Journals 
Consensus mechanisms:
    
If peer review is chosen they have the below options

    Remain anonymous / show identity of authorship

     I think they should also be able to select if they want the reviewers identity to be public (at least when theirs is public too)

    Only people from specific fields can peer review article / anyone can peer review the article

    Number of required peer reviews Should we set the minimum to three though?

    We should also have an option to decide if the reports are made open or not (both author and reviewer)

If remain anonymous is chosen, peer reviewers cannot see the authorship of the document
If show identity is chosen, peer reviewers can see authorship
If peer review from specific fields is chosen, the user can choose from the below list: Not convinced such a dropdown list is helpful, it seems too generalist for me (I'm in computer science, but there is only a fraction of papers in CS that I can review). Use keywords instead (that the submitter can choose freely)?
I agree. Currently, the whole idea of peer review described here is completly crowd based. Is this our intention? No matter if you select that anyone can review the paper or only someone of a specific field there will always be a very big group of people who could be the reviewer of your manuscript and the chance that a real expert of your specific sub-research field will find the paper and wants to review it is low. I really like the community approach mentioned in the the outlook of the article we cite in the white paper: https://github.com/aletheia-foundation/aletheia-whitepaper/blob/master/Submitted-Ver-1.pdf There, groups of moderators are described which handle the peer review process. Rather then predefining the research fields one could allow the community to form these moderator groups for specific research fields on its own. The groups could get also reputation and authors could choose if they apply for the general public review or directly for a specific moderator group. A moderator group could also invite reviewers which are not part of Aletheia so far and therefore increase the community further.

    Performing arts

    Visual arts

    Geography

    History

    Languages and literature

    Philosophy

    Theology

    Anthropology

    Economics

    Law

    Political science

    Psychology

    Sociology

    Biology

    Chemistry

    Earth sciences

    Space sciences

    Physics

    Computer Science

    Mathematics

    Statistics

    Engineering

    Medicine and health sciences

Rather than use these fields, users can specify tags that gain reputation
There is incentive to peer review in peer review notes will gain more rep the sooner I get it in and the more citations a paper gets
Also to incentivise peer review - overlay journals which abstracted out become dao journals
peer reviews should be filterable by tags, reputation and overlay journal/community
If anyone can peer review is chosen there is no list.
For number of peer reviews the submitter specifies a number
Weather anonymity or not or peer review from field or open peer review is chosen doesn't influence the flow of the paper
The paper is now submitted pending peer review

Peer Review
User opens their client and sees a notification for papers that are pending peer review

    If you tied your Aletheia identity to a particular field you will see papers in your field pending peer review along with papers that are flagged as anyone can peer review

    If you did not tie your Aletheia identity to a particular field you will see papers pending peer review that are marked anyone can review

User clicks on the notification and is taken to a list of pending papers
User chooses a paper they want to review. The paper is downloaded. 

    If the paper was flagged as authorship open they can see the author

    if the paper was flagged as authorship anonymous they cannot see the authorship

User reads the paper and makes their peer review notes
User uploads their peer review notes. They have the below options

    Remain anonymous / show identity of peer review

Once the number of reviews reaches the specified number of reviews the reviews are sent to the submitter.
The submitter opens their client and sees the notification for the peer review notes
the submitter clicks on the notification and downloads the reviews
If the reviewer chose to remain anonymous there will be no identity tied to the review
If the review is open the name of the reviewer will be seen
The submitter makes changes to their document based on the reviews and resubmits, this time choosing no peer review.

After changes have been made to the document, should the reviewer give an opinion of the paper before it finally passes the review process ? If his concens have been addressed and so on... Should there only be one iteration of the review process? From my experience there can be often several iterations before the remarks of reviewer are addressed completly. 
I agree with Chris on this

This comment is more related to our identity system. However, I think there should be a distinction between the reviewer, and the institution that they represent (or not as the case my be)... so the following scenarios can be supported:
    1. I am Professor Michael Shanks, reviewing this on behalf of the Physics Department of the University of Belfast
    2. I am professor Michael Shanks, reviewing this on my own behalf.... but i also am an employee of the Physics Department of the University of Belfast
    3. I am Michael Shanks, i have some qualifications, but am not affiliated with any institutions
    4. I am Michael Shanks, a member of the public with a strong interest in science
So, with regard to submitting a peer review, I think we should be considering reviewer identity and affiliated institutions as two separated (but linked) items.

Comment on fields of expertise: keywords would be more meaningful than predefined categories

Vote of acceptance
The paper now goes to a community vote, basic vote based on a quorum of active users. The vote is on the question "Is this paper scientific research or not?" The question is deliberately broad  and is intended as a check against people using Aletheia as external storage for pirated movies etc.
If quorum is met, the paper is accepted into Aletheia.
If the paper was peer reviewed the original paper, the amended peer review paper, peer review notes and datasets will all be associated together and can be given individual scores by anyone
the score is reputation that flows back to the person submitting the paper or making the peer review and flows back to them regardless of their identity is shown or kept anonymous. In this way, people are incentivised, even if anonymous, to go the right thing.

Mike: I think that users should be incentivised to correctly judge whether "this paper is scientific research". E.g. If I voted "Yes", and a quorum of "Yes" is reached, then then I receive positive reputation. If i were to vote "No", against a quorum of "Yes", then i receive negative reputation. 
Elegant. we will add
Should there be some guidance on what makes "this paper scientific research" ? I can see there being a grey area - where peers are prejudging by the quality of the paper. Should the question be closer to "Is this paper a genuine attempt at scientific research? "   ? I also prefer the latter formulation  Should there be just one question, or a (small) set of questions according to what makes a paper "scientfic"?

So far, I have only really read here about incentives based on a reputation system. Is there any scope for monetary (crypto currency) incentives. E.g. a "bounty" applied to a smart contract, which can be collected by reviewers, under certain rules. No, peer review should not be monetized, it'll create a perverse system.
I agree with Lisa, but worth noting I have had researchers say to me they want a monetised system

*** For future discussion***

Will the reputation only be base on user rating, or should also other factors like number of citation have an influence?

Regarding reputation there was another interesting suggestion in the paper   https://github.com/aletheia-foundation/aletheia-whitepaper/blob/master/Submitted-Ver-1.pdf :
"One further problem with reputation systems is that having a single formula to derive reputation leaves the system open to gaming, as with almost any process that can be measured and quantified. Gashler (2008) pro- posed a decentralized and secured system where each re- viewer would digitally sign each paper, hence the digital signature would link the review with the paper. Such a web of reviewers and papers could be data mined to reveal information on the influence and connectedness of individual researchers within the research community. Depending on how the data were mined, this could be used as a reputation system or web-of-trust system that would be resistant to gaming because it would specify no particular metric."
I think that finding the right reputation system to set good incentives for a vital research community is very difficult. For instance, if the reviewer profits from the user rating or the number of citations the paper gets he will be motivated to review only papers which he expects to receive good ratings. This should not be the intention of the system. I agree that reputation should be based on more than just 1 factor, but it's difficult to choose reliable/open metrics. Things like altmetrics could be included, but they also have their limitations. I also think that reputation should not just be based on quantitative things, but the quality/qualitative context of the engagement. I don't know how to realize that though, so ideas are welcome.
To incentivise high usage, we would want to give "points" for volume. However, quality can only be judged by other humans. So, we may want to then think about incentivising users to review & vote on others' reviews. In any case, the only way this can be taken forward is by coming up with models, then discussing how we can break/game them

Submission information
The options that should be available for submission

    The contributors to the article - text field

    Conributor identifiers, such as ORCIDs - text field

    The date the article was published - number field with checkbox to indicate never printed before, if ticked it defaults to today's date

     An abstract of the article - text field

    The language the article is written in - text field

    The publisher of the article if published elsewhere previously - text field

    A list of related resources - text field, we have hopes down the track of linking articles already stored on Aletheia but not required for a first iteration

    The source of the article’s contents - text field, again same as above

     The subject of the article - text field

What is meant by the subject of the article? Abstract and keywords should be enough no?

    The title of the article - text field

    Discipline of the article - drop down from the following

    Performing arts

    Visual arts

    Geography

    History

    Languages and literature

    Philosophy

    Theology

    Anthropology

    Economics

    Law

    Political science

    Psychology

    Sociology

    Biology

    Chemistry

    Earth sciences

    Space sciences

    Physics

    Computer Science

    Mathematics

    Statistics

    Engineering

    Medicine and health sciences

    Author's contributions - text field

    Author's affiliations - text field

Affiliations - see comments above in peer review section. I assume that and example of an Affiliation would be "University of Belfast" (where the researcher works). I think that an affiliation should not just be a text field, but a link to a verified data structure. E.g. "The University of Belfast" should have its own identity, with a confirmed list of affiliated Researchers. That list would have to be updated on a regular basis and we would need to get that information from somewhere. Some universities don't update this part of their websites regularly, or let's say it takes them a while.
-but would they not be incentivised to keep it updated, as not doing so would mean that their researchers may not be properly attributing their work? I would have thought that these Institutions would have an interest in being part of the reputation system ? I don't believe we could reliably do this with a free text field.

    Funding body - text field with a check box for indicating no funding was received for the research

    Keywords - text box

    Publication date range - number field

    Pre-Print - a check box for yes and no


It could be useful to use the same template as an established open submission system (e.g., Arxiv, BioArxiv), and have a tool that can import most of the data automatically from these websites

Should all this information be saved in the blockchain? I would assume that there should be only some very basic information, like title, hash of document, list of authors and references to other documents in the blockchain and all other information linked to somewhere else.

Questions that have come out of our meeting 16/10/2017

    How do we identify real users and not an army of bots

    How will we manage ORCID - centralised server where people log into Aletheia, pushes out to log into orcid, the two connect. Or,  Oraclise which is a lesser system. Means we run a centralised server but is a compromise we may have to make

    As part of signing up to Aletheia the first time, would need to generate an ethereum addresss or be able to specify one, also specify public/private key set or or have one generated for you

    Preprint sever - fix your logical error where you listed doesn't hit the community vote until post peer review, should hit it immediately

    When are papers done? papers are never done, peer review is always open, papers will become more than "papers" as they continue to evolve, authors can come and go

    We are keeping the one basic question as our vetting mechanism, we are yet to decide how quorum is met and what the question actually is


