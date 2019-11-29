import React, { FunctionComponent, useState } from 'react'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'
import OpenWithSharpIcon from '@material-ui/icons/OpenWithSharp'
import CloseIcon from '@material-ui/icons/Close'
import Modal from '@material-ui/core/Modal'
import HowToRegIcon from '@material-ui/icons/HowToReg'
import { useParams } from 'react-router-dom'
import _find from 'lodash/find'

const globalStyles = require('../global_styles.css')
const { vibrantGreen } = globalStyles
import { formatUpdatedAt } from '../helpers'

import { IJob } from '../types'

const styles = ({ palette, spacing, shadows }: ITheme) => {
  return createStyles({
    root: {
      marginTop: '52vh',
      height: '48vh'
    },
    topSection: {
      display: 'grid',
      gridTemplateColumns: '40px 3fr 1fr',
      gridTemplateRows: '1fr 1fr',
      /* eslint-disable @typescript-eslint/quotes */
      gridTemplateAreas: `'status name owner-icon' '. description owner'`,
      alignItems: 'center'
    },
    lastUpdated: {
      color: palette.grey[600]
    },
    _status: {
      gridArea: 'status',
      width: spacing(2),
      height: spacing(2),
      borderRadius: '50%'
    },
    failed: {
      backgroundColor: palette.error.main
    },
    passed: {
      backgroundColor: vibrantGreen
    },
    _name: {
      gridArea: 'name'
    },
    _description: {
      gridArea: 'description'
    },
    _owner: {
      gridArea: 'owner',
      justifySelf: 'end'
    },
    _ownerIcon: {
      gridArea: 'owner-icon',
      justifySelf: 'end'
    },
    _SQL: {
      overflow: 'hidden'
    },
    _SQLComment: {
      color: palette.grey[400]
    },
    SQLModal: {
      backgroundColor: 'white',
      position: 'relative',
      padding: spacing(2),
      width: '80%',
      height: '80%',
      margin: '10%',
      overflow: 'scroll',
      boxShadow: shadows[1],
      // using border to create effect of padding, which will not work when there's overflow
      border: '1rem solid white',
      borderTop: 'none',
      borderLeft: '2rem solid white'
    },
    SQLModalTitle: {
      fontSize: '2rem',
      fontWeight: 700
    }
  })
}

type IProps = IWithStyles<typeof styles> & { jobs: IJob[] }

const StyledTypography = withStyles({
  root: {
    maxWidth: '90%'
  }
})(Typography)

const StyledTypographySQL = withStyles({
  root: {
    whiteSpace: 'pre',
    fontFamily: `'Inconsolata', monospace`
  }
})(Typography)

const StyledExpandButton = withStyles({
  root: {
    transform: 'rotate(45deg)',
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    cursor: 'pointer'
  }
})(OpenWithSharpIcon)

const StyledCloseIcon = withStyles({
  root: {
    position: 'absolute',
    right: 0,
    top: '1rem',
    backgroundColor: 'white',
    cursor: 'pointer'
  }
})(CloseIcon)

const displaySQL = (SQL: string, SQLCommentClass: string) => {
  return SQL ? (
    SQL.split('\n').map((line, i) => {
      const extraClass = line.trim().startsWith('--') ? SQLCommentClass : ''

      return (
        <StyledTypographySQL key={i} className={extraClass}>
          {line}
        </StyledTypographySQL>
      )
    })
  ) : (
    <StyledTypographySQL align='center'>
      There is no SQL for this job at this time.
    </StyledTypographySQL>
  )
}
const JobDetailPage: FunctionComponent<IProps> = props => {
  const [SQLModalOpen, setSQLModalOpen] = useState(false)
  const { jobs, classes } = props
  const {
    root,
    _status,
    _name,
    _description,
    _SQL,
    _SQLComment,
    SQLModal,
    SQLModalTitle,
    _owner,
    _ownerIcon,
    lastUpdated,
    topSection
  } = classes
  const { jobName } = useParams()
  const job = _find(jobs, j => j.name === jobName)
  if (!job) {
    return (
      <Box
        p={4}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        className={root}
      >
        <Typography align='center'>
          No job by the name of <strong>&quot;{jobName}&quot;</strong> found
        </Typography>
      </Box>
    )
  }
  const {
    name,
    description,
    updatedAt = '',
    status = 'passed',
    location,
    namespace,
    context = { SQL: null }
  } = job

  let { SQL } = context
  SQL = `\n-- IMPORTANT: THIS IS GETTING WRITTEN IN SNOWFLAKE TOO, IF MODIFYING THIS FILE PLEASE MAKE THE SAME CHANGES IN SNOWFLAKE\n--data source: ID, Mena, Spaceman\n\nWITH\n\nnumbers_10 AS\n(\n    SELECT 0 AS num UNION ALL\n    SELECT 1 UNION ALL\n    SELECT 2 UNION ALL\n    SELECT 3 UNION ALL\n    SELECT 4 UNION ALL\n    SELECT 5 UNION ALL\n    SELECT 6 UNION ALL\n    SELECT 7 UNION ALL\n    SELECT 8 UNION ALL\n    SELECT 9\n)\n\n, numbers_100 AS\n(\n    SELECT (n1.num::VARCHAR||n2.num::VARCHAR)::INT num\n    FROM numbers_10 n1\n    CROSS JOIN numbers_10 n2\n)\n\n, numbers_10000 AS\n(\n    SELECT (n1.num::VARCHAR||n2.num::VARCHAR)::INT num\n    FROM numbers_100 n1\n    CROSS JOIN numbers_100 n2\n)\n\n, max_websites AS\n(\n    SELECT MAX(JSON_ARRAY_LENGTH(websites,TRUE)) AS max_count FROM mena_public.companies\n)\n\n, websites_tidy AS\n(\n    SELECT DISTINCT id AS mena_account_id\n            , JSON_EXTRACT_PATH_TEXT(NULLIF(JSON_EXTRACT_ARRAY_ELEMENT_TEXT(websites, num, TRUE), ''),'content') url\n    FROM mena_public.companies\n    INNER JOIN numbers_10000\n    ON numbers_10000.num <= (SELECT max_count FROM max_websites)\n    where nvl(_fivetran_deleted, false) = false\n)\n\n, websites_tidy_cleaned AS\n(\n    SELECT  mena_account_id\n            , REGEXP_REPLACE(REPLACE(LOWER(url),'www.',''), '.*(https?://)','') AS url\n    FROM websites_tidy\n    WHERE url IS NOT NULL\n    AND STRPOS(url,'.') <> 0\n)\n\n, website_domain_suffix AS (\n    SELECT  mena_account_id\n            ,url\n            , REGEXP_REPLACE(\n                REPLACE(REPLACE(LOWER(url),'https', 'http'),\n                        'http://',\n                        ''),\n                '/.*'\n                '') AS domain\n            , '/'||NULLIF(TRIM(REGEXP_REPLACE(\n                REPLACE(REPLACE(LOWER(url),'https', 'http'),\n                        'http://',\n                        ''),\n                '^[^/]+/?',\n                '')),'') AS url_suffix\n    FROM websites_tidy_cleaned\n)\n\n, website_account AS (\n    select mena_account_id\n        , listagg(case when domain like 'facebook%' then domain||url_suffix end, ',') as facebook_mena\n        , listagg(case when domain like 'instagram%' then domain||url_suffix end, ',') as instagram_mena\n        , listagg(case when domain like 'twitter%' then domain||url_suffix end, ',') as twitter_mena\n        , listagg(case when domain like '%linkedin%' then domain||url_suffix end, ',') as linkedin_mena\n        , listagg(case when domain not like '%linkedin%'\n                        and domain not like 'twitter%'\n                        and domain not like 'instagram%'\n                        and domain not like 'facebook%'\n                        then domain||url_suffix end, ',') as other_websites_mena\n    from website_domain_suffix\n    group by mena_account_id\n)\n\n, onboarding_response as (\n--need to figure out why some companies has multiple onboarding survey responses (sometimes different responsees from same company/person), might have to do with different type of onboarding forms\n--meeting Aviad 11/13\n--TBD in that case do we get the most recent response or what\n    select ma.account_uuid\n        , JSON_EXTRACT_PATH_TEXT(sm.survey_info, 'industry') as indutry\n        , JSON_EXTRACT_PATH_TEXT(sm.survey_info, 'intended_stay') as intended_stay\n        , JSON_EXTRACT_PATH_TEXT(sm.survey_info, 'primary_use') as primary_use\n        , JSON_EXTRACT_PATH_TEXT(sm.survey_info, 'date_founded') as date_founded\n        , row_number() over (partition by ma.account_uuid order by ma.created_at desc) as rank\n    from spacemoney_public.agreement_form_infos sm\n        inner join spaceman_public.membership_agreements ma\n            on ma.uuid = sm.membership_agreement_uuid\n        inner join id_public.companies id\n            on ma.account_uuid = id.uuid\n    where (trim(JSON_EXTRACT_PATH_TEXT(sm.survey_info, 'industry')) != ''\n        or trim(JSON_EXTRACT_PATH_TEXT(sm.survey_info, 'intended_stay')) != ''\n        or trim(JSON_EXTRACT_PATH_TEXT(sm.survey_info, 'primary_use')) != ''\n        or trim(JSON_EXTRACT_PATH_TEXT(sm.survey_info, 'date_founded')) != ''\n        )\n        and ma.signed_at is not null\n        and nvl(sm._fivetran_deleted, false) = false\n        and nvl(ma._fivetran_deleted, false) = false\n        and nvl(id._fivetran_deleted, false) = false\n)\n\n, service_tags as (\n    select taggings.taggable_id as account_id\n        , listagg(tags.name, ',') as tags\n    from mena_public.taggings\n        inner join mena_public.tags\n            on taggings.tag_id = tags.id\n    where taggable_type = 'Company'\n        and context = 'services'\n        and nvl(taggings._fivetran_deleted, false) = false\n        and nvl(tags._fivetran_deleted, false) = false\n    group by taggings.taggable_id\n)\n\n, reservation_commitment_terms as (\n  select  smr.reservable_type\n        , smr.account_id\n        , smr.type\n        , smr.location_id\n        , smt.started_on\n        , smt.ended_on\n        , smr.id\n    from spaceman_public.reservations smr\n      left join spaceman_public.terms smt\n        on smt.termable_type = 'ReservationBase'\n        and smt.type = 'CommitmentTerm'\n        and smt.termable_id = smr.id\n  where smt.termable_id is not null\n)\n\n, latest_account_terms as (\n    select DISTINCT\n      lt1.account_id,\n      lt1.location_id,\n      lt1.reservable_type,\n      lt1.type,\n      lt1.started_on,\n      lt1.ended_on\n    from reservation_commitment_terms lt1\n      left outer join reservation_commitment_terms lt2\n        on lt1.account_id = lt2.account_id\n           and (lt1.ended_on < lt2.ended_on\n                or (lt1.ended_on = lt2.ended_on\n                    and lt1.id < lt2.id\n                )\n           )\n    where lt2.account_id is null\n)\n\n, spaceman as (\n    select sma.uuid as uuid\n         , sma.legal_name as legal_name_spaceman\n         , sma.short_code as short_code_spaceman\n         , lat.location_id as latest_commitment_location_id_spaceman\n         , lat.reservable_type as latest_commitment_reservable_type_spaceman\n         , lat.type as latest_commitment_type_spaceman\n         , lat.started_on as latest_commitment_start_date_spaceman\n         , lat.ended_on as latest_commitment_end_date_spaceman\n    from spaceman_public.accounts sma\n    left join latest_account_terms lat on lat.account_id = sma.id\n)\n\nselect id.uuid as uuid\n\n    --name\n    , id.name as name_id\n    , mena.name as name_mena\n    , mena.legal_name as legal_name_mena\n\n    --email\n    , mena.email as email_mena\n\n    --created at\n    , MAX(mena.created_at) as created_at_mena\n    , MAX(id.created_at) as created_at_id\n\n\n    --num employee\n    , mena.number_of_employees as employee_size_mena\n\n    --mena locations\n    , mena.current_location_id as current_location_id_mena\n    , mena.initial_location_id as initial_location_id_mena\n\n    --date_founded\n    , mena.founding_date date_founded_mena\n    , onboarding_response.date_founded as date_founded_spacemoney\n\n    --industry\n    , mena.industry as industry_mena\n    , onboarding_response.indutry as indutry_spacemoney\n\n    --other spacemoney info\n    , onboarding_response.intended_stay as intended_stay_spacemoney\n    , onboarding_response.primary_use as primary_use_spacemoney\n\n    --social_media\n    , website_account.facebook_mena\n    , website_account.linkedin_mena\n    , website_account.twitter_mena\n    , website_account.instagram_mena\n    , website_account.other_websites_mena\n\n    --other mena info\n    , case when mena.avatar_file_name is not null and trim(mena.avatar_file_name) !='' then true::boolean\n            else false::boolean\n            end as has_logo_mena\n    , service_tags.tags as service_tags_mena\n\n    -- spaceman account and commitment info\n    , spaceman.legal_name_spaceman\n    , spaceman.short_code_spaceman\n    , spaceman.latest_commitment_location_id_spaceman\n    , spaceman.latest_commitment_reservable_type_spaceman\n    , MAX(spaceman.latest_commitment_start_date_spaceman) AS latest_commitment_start_date_spaceman\n    , MAX(spaceman.latest_commitment_end_date_spaceman) AS latest_commitment_end_date_spaceman\n\nfrom id_public.companies id\n    left outer join mena_public.companies mena\n        on id.uuid = mena.uuid\n        and nvl(id._fivetran_deleted, false) = false\n        and nvl(mena._fivetran_deleted, false) = false\n    left outer join website_account\n        on mena.id = website_account.mena_account_id\n    left outer join service_tags\n        on mena.id = service_tags.account_id\n    left outer join onboarding_response\n        on mena.uuid = onboarding_response.account_uuid\n        and onboarding_response.rank = 1\n    left outer join spaceman\n        on id.uuid = spaceman.uuid\n    WHERE mena.deleted_at IS NULL\n    GROUP BY\n      id.uuid\n    , id.name\n    , mena.name\n    , mena.legal_name\n    , mena.email\n    , mena.number_of_employees\n    , mena.current_location_id\n    , mena.initial_location_id\n    , mena.founding_date\n    , onboarding_response.date_founded\n    , mena.industry\n    , onboarding_response.indutry\n    , onboarding_response.intended_stay\n    , onboarding_response.primary_use\n    , website_account.facebook_mena\n    , website_account.linkedin_mena\n    , website_account.twitter_mena\n    , website_account.instagram_mena\n    , website_account.other_websites_mena\n    , case when mena.avatar_file_name is not null and trim(mena.avatar_file_name) <> '' then true::boolean\n            else false::boolean\n            end\n    , service_tags.tags\n    , spaceman.legal_name_spaceman\n    , spaceman.short_code_spaceman\n    , spaceman.latest_commitment_location_id_spaceman\n    , spaceman.latest_commitment_reservable_type_spaceman"},"description":"dim_account_member_360_dag"`
  return (
    <Box
      p={4}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      className={root}
    >
      <div className={topSection}>
        <div className={`${_status} ${classes[status]}`} />
        <Typography color='secondary' className={_name}>
          <a href={location} className='link' target='_'>
            {name}
          </a>
        </Typography>
        <StyledTypography color='primary' className={_description}>
          {description}
        </StyledTypography>
        <HowToRegIcon color='secondary' className={_ownerIcon} />
        <Typography className={_owner}>{namespace}</Typography>
      </div>
      <Box
        className={_SQL}
        width='80%'
        minHeight={200}
        maxHeight={250}
        bgcolor='white'
        boxShadow={1}
        // using border to create effect of padding, which will not work when there's overflow
        border='1rem solid white'
        borderLeft='2rem solid white'
        mx='auto'
        my={2}
        borderRadius='3px'
        position='relative'
      >
        <StyledExpandButton color='secondary' onClick={() => setSQLModalOpen(true)} />
        <Modal aria-labelledby='modal-title' open={SQLModalOpen}>
          <div className={SQLModal}>
            <StyledCloseIcon fontSize='large' onClick={() => setSQLModalOpen(false)} />
            <Typography id='modal-title' align='center' gutterBottom className={SQLModalTitle}>
              {name}
            </Typography>
            {displaySQL(SQL, _SQLComment)}
          </div>
        </Modal>
        {displaySQL(SQL, _SQLComment) // here is a comment to make the line longer
        }
      </Box>
      <Typography className={lastUpdated} align='right'>
        {formatUpdatedAt(updatedAt)}
      </Typography>
    </Box>
  )
}

export default withStyles(styles)(JobDetailPage)
