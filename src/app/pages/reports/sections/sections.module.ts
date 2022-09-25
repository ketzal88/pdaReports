import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverIndividualSectionComponent } from './cover-individual-section/cover-individual-section.component';
import { JobCompatibilitySectionComponent } from './job-compatibility-section/job-compatibility-section.component';
import { MaterialModule } from '../../../shared/material/material.module';
import { ChartsModule } from '../../../shared/components/charts/charts.module';
import { CardModule } from '../../../shared/components/card/card.module';
import { JobCompatibilityMultipleColumnsSectionComponent } from './job-compatibility-multiple-columns-section/job-compatibility-multiple-columns-section.component';
import { JobCompatibilityIndividualAreaSectionComponent } from './job-compatibility-individual-area-section/job-compatibility-individual-area-section.component';
import { BehavioralGraphComponent } from './behavioral-graph/behavioral-graph.component';
import { FormsModule } from '@angular/forms';
import { BehavioralTrendComponent } from './behavioral-trend/behavioral-trend.component';
import { AgeGenderBalanceComponent } from './age-gender-balance/age-gender-balance.component';
import { BehavioralProfilePersonComponent } from './behavioral-profile-person/behavioral-profile-person.component';
import { SelfDescriptionComponent } from './self-description/self-description.component';
import { EmotionalInteligenceSectionComponent } from './emotional-inteligence-section/emotional-inteligence-section.component';
import { BehavioralProfileDescriptionSectionComponent } from './behavioral-profile-description-section/behavioral-profile-description-section.component';
import { PotentialDeploymentComponent } from './potential-deployment/potential-deployment.component';
import { CommunicationStyleComponent } from './communication-style/communication-style.component';
import { HowToLeadIndividualComponent } from './how-to-lead-individual/how-to-lead-individual.component';
import { StrengthsOverusedSectionComponent } from './strengths-overused-section/strengths-overused-section.component';
import { BehavioralProfileChartSectionComponent } from './behavioral-profile-chart-section/behavioral-profile-chart-section.component';
import { ProfileItemComponent } from './profile-item/profile-item.component';
import { ConsistencySectionComponent } from './consistency-section/consistency-section.component';
import { CompetenciesSectionComponent } from './competencies-section/competencies-section.component';
import { DiscoverYourUniquenessComponent } from './discover-your-uniqueness/discover-your-uniqueness.component';
import { ImageProfileTypeComponent } from './image-profile-type/image-profile-type.component';
import { ExpandedBehavioralProfileComponent } from './expanded-behavioral-profile/expanded-behavioral-profile.component';
import { CurrentSituationComponent } from './current-situation/current-situation.component';
import { BehavioralTrendsComponent } from './behavioral-trends/behavioral-trends.component';
import { DevelopmentPlanComponent } from './development-plan/development-plan.component';
import { CarouselModule } from '../../../shared/components/carousel/carosuel.module';
import { BehavioralGraphService } from './behavioral-graph/behavioral-graph.service';
import { JobCompatibilitySectionService } from './job-compatibility-section/job-compatibility-section.service';
import { HRFeedbackComponent } from './hr-feedback/hr-feedback.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from '../../../shared/components/icons/icons.module';
import { QuestionBehavioralProfileComponent } from './question-behavioral-profile/question-behavioral-profile.component';
import { KnowWilliamMarstonTheoryComponent } from './know-william-marston-theory/know-william-marston-theory.component';
import { KnowBehavioralProfileComponent } from './know-behavioral-profile/know-behavioral-profile.component';
import { ImageFullProfileTypeComponent } from './image-full-profile-type/image-full-profile-type.component';
import { KnowYourKeyCompetenciesComponent } from './know-your-key-competencies/know-your-key-competencies.component';
import { KnowYourProfileComparedSkillsFutureComponent } from './know-your-profile-compared-skills-future/know-your-profile-compared-skills-future.component';
import { ProcessFeedbackComponent } from './process-feedback/process-feedback.component';
import { KnowMoreBehavioralProfileComponent } from './know-more-behavioral-profile/know-more-behavioral-profile.component';
import { ExploreYourCVWithTheseTipsComponent } from './explore-your-cvwith-these-tips/explore-your-cvwith-these-tips.component';
import { VideoSectionComponent } from './video-section/video-section.component';
@NgModule({
  declarations: [
    CoverIndividualSectionComponent,
    JobCompatibilitySectionComponent,
    BehavioralGraphComponent,
    BehavioralTrendComponent,
    AgeGenderBalanceComponent,
    JobCompatibilityIndividualAreaSectionComponent,
    JobCompatibilityMultipleColumnsSectionComponent,
    BehavioralProfilePersonComponent,
    SelfDescriptionComponent,
    EmotionalInteligenceSectionComponent,
    BehavioralProfileDescriptionSectionComponent,
    PotentialDeploymentComponent,
    CommunicationStyleComponent,
    HowToLeadIndividualComponent,
    StrengthsOverusedSectionComponent,
    BehavioralProfileChartSectionComponent,
    ProfileItemComponent,
    ConsistencySectionComponent,
    CompetenciesSectionComponent,
    DiscoverYourUniquenessComponent,
    ImageProfileTypeComponent,
    ExpandedBehavioralProfileComponent,
    CurrentSituationComponent,
    BehavioralTrendsComponent,
    DevelopmentPlanComponent,
    HRFeedbackComponent,
    QuestionBehavioralProfileComponent,
    KnowWilliamMarstonTheoryComponent,
    KnowBehavioralProfileComponent,
    ImageFullProfileTypeComponent,
    KnowYourKeyCompetenciesComponent,
    KnowYourProfileComparedSkillsFutureComponent,
    ProcessFeedbackComponent,
    KnowMoreBehavioralProfileComponent,
    ExploreYourCVWithTheseTipsComponent,
    VideoSectionComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ChartsModule,
    CardModule,
    FormsModule,
    CarouselModule,
    TranslateModule,
    IconsModule,
  ],
  exports: [
    CoverIndividualSectionComponent,
    JobCompatibilitySectionComponent,
    BehavioralGraphComponent,
    BehavioralTrendComponent,
    AgeGenderBalanceComponent,
    JobCompatibilityIndividualAreaSectionComponent,
    JobCompatibilityMultipleColumnsSectionComponent,
    BehavioralProfilePersonComponent,
    SelfDescriptionComponent,
    EmotionalInteligenceSectionComponent,
    BehavioralProfileDescriptionSectionComponent,
    PotentialDeploymentComponent,
    CommunicationStyleComponent,
    HowToLeadIndividualComponent,
    StrengthsOverusedSectionComponent,
    BehavioralProfileChartSectionComponent,
    ProfileItemComponent,
    ConsistencySectionComponent,
    CompetenciesSectionComponent,
    DiscoverYourUniquenessComponent,
    ImageProfileTypeComponent,
    ExpandedBehavioralProfileComponent,
    CurrentSituationComponent,
    BehavioralTrendsComponent,
    DevelopmentPlanComponent,
    HRFeedbackComponent,
    QuestionBehavioralProfileComponent,
    KnowWilliamMarstonTheoryComponent,
    KnowBehavioralProfileComponent,
    ImageFullProfileTypeComponent,
    KnowYourKeyCompetenciesComponent,
    KnowYourProfileComparedSkillsFutureComponent,
    ProcessFeedbackComponent,
    KnowMoreBehavioralProfileComponent,
    ExploreYourCVWithTheseTipsComponent,
    VideoSectionComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [BehavioralGraphService, JobCompatibilitySectionService],
})
export class SectionsModule {}
